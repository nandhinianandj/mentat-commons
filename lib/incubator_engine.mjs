import fs from 'fs/promises';
import path from 'path';
import { loadCKB, searchCKB, callLLM } from './rag_ckb.mjs';
import { getItems, getIdeas, saveIdeas, getQuestionDrifts, saveQuestionDrifts } from './radar_db.mjs';

function getTokens(text) {
  if (!text) return new Set();
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4)
  );
}

function calculateJaccard(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// Compute scores according to specification
function calculatePersistenceScore(idea, dateStr) {
  const first = new Date(idea.firstSeen);
  const last = new Date(idea.lastSeen);
  const longevityDays = Math.max(1, Math.round((last - first) / (1000 * 60 * 60 * 24)));
  
  const uniqueDomains = new Set(idea.domains || []);
  const uniqueUrls = new Set(idea.sourceUrls || []);
  
  // Weights: longevity (40%), mentions (20%), source count (20%), domain count (20%)
  const longevityTerm = Math.min(40, longevityDays * 0.5);
  const mentionsTerm = Math.min(20, (idea.totalMentions || 1) * 1.5);
  const sourceTerm = Math.min(20, uniqueUrls.size * 3.0);
  const domainTerm = Math.min(20, uniqueDomains.size * 5.0);
  
  const score = Math.round(longevityTerm + mentionsTerm + sourceTerm + domainTerm);
  return Math.min(100, Math.max(0, score));
}

function calculateAlignmentScore(idea, ckb) {
  let overlapCount = 0;
  const ideaTokens = getTokens(`${idea.title} ${idea.summary}`);
  
  // Compare tokens against CKB summaries, roles, and descriptions
  const compareText = (text) => {
    const tokens = getTokens(text);
    tokens.forEach(t => {
      if (ideaTokens.has(t)) overlapCount++;
    });
  };

  (ckb.experiences || []).forEach(e => compareText(`${e.role} ${e.summary} ${e.responsibilities.join(' ')}`));
  (ckb.projects || []).forEach(p => compareText(`${p.title} ${p.problem} ${p.solution} ${p.architecture}`));
  
  // Calculate raw score (cap at 80)
  const rawScore = Math.min(80, overlapCount * 4);
  
  // Apply Career Axes Boost (25% boost if matched)
  const matchedAxes = idea.domains || [];
  const hasAxisMatch = matchedAxes.some(dom => 
    dom.toLowerCase().includes('leadership') || 
    dom.toLowerCase().includes('human') || 
    dom.toLowerCase().includes('decision')
  );
  
  const finalScore = hasAxisMatch ? rawScore * 1.25 : rawScore;
  return Math.min(100, Math.round(finalScore));
}

function determineMaturityScore(stage) {
  const stages = {
    'seed': 10,
    'interesting': 30,
    'recurring': 50,
    'persistent': 70,
    'research_worthy': 85,
    'signature_theme': 95,
    'consulting_capability': 100
  };
  return stages[stage.toLowerCase()] || 10;
}

// Lifecycle State Machine transitions recommendation
function recommendStageTransition(idea, pScore, aScore) {
  const current = idea.stage.toLowerCase();
  
  if (current === 'seed') {
    if (idea.totalMentions >= 2 && idea.sourceCount >= 2) return 'interesting';
  }
  if (current === 'interesting') {
    if (idea.totalMentions >= 5 && idea.sourceCount >= 3) return 'recurring';
  }
  if (current === 'recurring') {
    if (idea.totalMentions >= 8 && pScore >= 40) return 'persistent';
  }
  if (current === 'persistent') {
    if (pScore >= 60 && aScore >= 50) return 'research_worthy';
  }
  if (current === 'research_worthy') {
    if (pScore >= 80 && aScore >= 75) return 'signature_theme';
  }
  if (current === 'signature_theme') {
    if (aScore >= 85 && (idea.domains || []).some(d => d.toLowerCase().includes('decision') || d.toLowerCase().includes('leadership'))) {
      return 'consulting_capability';
    }
  }
  return idea.stage; // No transition
}

export async function processIdeaIncubation(apiKey) {
  const date = new Date().toISOString().split('T')[0];
  console.log(`[Idea Incubator] Running conceptual incubation pipeline for ${date}...`);
  
  const items = await getItems();
  const existingIdeas = await getIdeas();
  const drifts = await getQuestionDrifts();
  const ckb = await loadCKB();
  
  const driftMap = new Map(drifts.map(d => [d.shallowTerm.toLowerCase(), d.deepQuestionTerm]));
  const ideasMap = new Map(existingIdeas.map(i => [i.title.toLowerCase(), i]));
  
  // 1. Group raw items from last 7 days to extract fresh concepts
  const freshItems = items.filter(item => {
    const pubDate = new Date(item.publishedAt || item.ingestedAt);
    const diff = (new Date() - pubDate) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const candidates = freshItems.length > 0 ? freshItems : items.slice(0, 100);
  console.log(`  - Inspecting ${candidates.length} candidate feed posts for concepts...`);

  const events = [];

  for (const item of candidates) {
    let conceptTitle = item.title;
    let deepQuestion = "What underlying coordination or design problem does this describe?";
    
    // Normalize terminology using question drift mappings
    let mapped = false;
    for (const [shallow, deep] of driftMap.entries()) {
      if (conceptTitle.toLowerCase().includes(shallow)) {
        conceptTitle = deep;
        deepQuestion = `Explores key constraints around: ${deep}`;
        mapped = true;
        break;
      }
    }
    
    if (!mapped) {
      // Clean up brackets, sources (e.g. "REDDIT:", "HN:")
      conceptTitle = conceptTitle.replace(/^[A-Z0-9-_\s]+:\s*/, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\(.*?\)/g, '')
        .trim();
    }
    
    if (conceptTitle.length < 10) continue;
    
    // Concept Merging Choice
    let matchedId = null;
    const itemTokens = getTokens(conceptTitle);
    
    // Heuristic Local Jaccard Match (Fallback)
    for (const existing of existingIdeas) {
      const existingTokens = getTokens(existing.title);
      let maxJaccard = calculateJaccard(itemTokens, existingTokens);
      
      // Also check alternative names
      const altNames = existing.alternative_names || [];
      altNames.forEach(alt => {
        const altTokens = getTokens(alt);
        const j = calculateJaccard(itemTokens, altTokens);
        if (j > maxJaccard) maxJaccard = j;
      });

      if (maxJaccard > 0.25) {
        matchedId = existing.id;
        break;
      }
    }
    
    const sourceDomain = item.url.includes('arxiv.org') ? 'Research Paper' : 
                         item.url.includes('github.com') ? 'Open Source' :
                         item.url.includes('news.ycombinator.com') || item.url.includes('hnrss.org') ? 'Hacker News' : 'Blogs';

    if (matchedId) {
      // Merge with existing idea
      const idea = existingIdeas.find(i => i.id === matchedId);
      idea.total_mentions += 1;
      idea.last_seen = date;
      
      const uniqueUrls = new Set(idea.source_urls || []);
      uniqueUrls.add(item.url);
      idea.source_urls = Array.from(uniqueUrls);
      idea.source_count = uniqueUrls.size;
      
      const uniqueDomains = new Set(idea.domains || []);
      uniqueDomains.add(sourceDomain);
      idea.domains = Array.from(uniqueDomains);

      events.push({ date, event: 'merge_mention', notes: `Added mention from feed item: "${item.title}"` });
    } else {
      // Create new Seed Idea
      const newId = 'idea-' + Math.random().toString(36).substring(2, 11);
      const newIdea = {
        id: newId,
        title: conceptTitle,
        alternative_names: [item.title],
        summary: item.description || item.title,
        first_seen: date,
        last_seen: date,
        total_mentions: 1,
        source_count: 1,
        source_urls: [item.url],
        domains: [sourceDomain],
        related_ideas: [],
        matched_ceg_entities: [],
        deep_question: deepQuestion,
        stage: 'seed',
        persistence_score: 0,
        novelty_score: 80, // initial high novelty
        maturity_score: 10,
        alignment_score: 0,
        suggested_actions: ['collect_evidence'],
        evolution_history: [{ date, event: 'seed', notes: 'Idea discovered in feed collections.' }]
      };
      existingIdeas.push(newIdea);
      events.push({ date, event: 'seed_creation', notes: `Seeded new idea: "${conceptTitle}"` });
    }
  }

  // 2. Score and recommendation stage transitions for all ideas
  for (const idea of existingIdeas) {
    const pScore = calculatePersistenceScore(idea, date);
    const aScore = calculateAlignmentScore(idea, ckb);
    const mScore = determineMaturityScore(idea.stage);
    
    // Cross-reference matched entities in CKB
    const cegMatches = await searchCKB(idea.title);
    idea.matched_ceg_entities = cegMatches.slice(0, 3).map(m => m.id);
    
    idea.persistence_score = pScore;
    idea.alignment_score = aScore;
    idea.maturity_score = mScore;
    idea.novelty_score = Math.max(10, 100 - pScore); // Novelty fades as persistence grows

    // Recommend actions based on scores
    const actions = ['collect_evidence'];
    if (aScore > 40) actions.push('research');
    if (pScore > 50) actions.push('linkedin');
    if (pScore > 75 && aScore > 70) actions.push('essay', 'workshop');
    if (idea.stage === 'consulting_capability') actions.push('service');
    idea.suggested_actions = actions;

    // Transition recommendations
    const nextStage = recommendStageTransition(idea, pScore, aScore);
    if (nextStage !== idea.stage) {
      idea.evolution_history.push({
        date,
        event: 'stage_promotion',
        notes: `Promoted from ${idea.stage} to ${nextStage} based on persistence (${pScore}%) and alignment (${aScore}%)`
      });
      idea.stage = nextStage;
    }
  }

  await saveIdeas(existingIdeas);
  console.log(`[Idea Incubator] Conceptual review completed. Saved ${existingIdeas.length} total ideas.`);
  return { date, ideas: existingIdeas, events };
}

// Compile the weekly review report
export async function compileWeeklyReview(apiKey) {
  const date = new Date().toISOString().split('T')[0];
  console.log(`[Idea Incubator] Compiling Weekly Review for ${date}...`);
  
  // Trigger incubation cycle first to fetch latest states
  const { ideas, events } = await processIdeaIncubation(apiKey);
  
  // Group findings
  const promotions = ideas.filter(i => 
    i.evolution_history.some(e => e.date === date && e.event === 'stage_promotion')
  );
  
  const signatureThemes = ideas.filter(i => i.stage === 'signature_theme' || i.stage === 'consulting_capability');
  const seeds = ideas.filter(i => i.stage === 'seed' && i.first_seen === date);
  
  const report = {
    date,
    promotions: promotions.map(p => ({
      title: p.title,
      stage: p.stage,
      pScore: p.persistence_score,
      aScore: p.alignment_score
    })),
    themes: signatureThemes.map(t => ({
      title: t.title,
      question: t.deep_question,
      entities: t.matched_ceg_entities
    })),
    newSeeds: seeds.map(s => s.title),
    actions: ideas.filter(i => i.persistence_score > 60).map(i => ({
      title: i.title,
      score: i.persistence_score,
      actions: i.suggested_actions
    }))
  };
  
  return report;
}
