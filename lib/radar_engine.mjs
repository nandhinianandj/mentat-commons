import { loadCKB, searchCKB, callLLM } from './rag_ckb.mjs';
import { getItems, getMemory, saveMemory, saveBriefing } from './radar_db.mjs';

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

export function clusterItems(items) {
  const clusters = [];
  const tokenized = items.map(item => ({
    item,
    tokens: getTokens(`${item.title} ${item.description}`)
  }));

  tokenized.forEach(({ item, tokens }) => {
    let added = false;
    for (const cluster of clusters) {
      let sumJaccard = 0;
      cluster.itemData.forEach(c => {
        sumJaccard += calculateJaccard(tokens, c.tokens);
      });
      const avgJaccard = sumJaccard / cluster.itemData.length;
      
      if (avgJaccard > 0.12) {
        cluster.items.push(item);
        cluster.itemData.push({ item, tokens });
        tokens.forEach(t => cluster.combinedTokens.add(t));
        added = true;
        break;
      }
    }
    
    if (!added) {
      clusters.push({
        id: 'cluster-' + Math.random().toString(36).substring(2, 11),
        title: item.title,
        items: [item],
        itemData: [{ item, tokens }],
        combinedTokens: new Set(tokens)
      });
    }
  });
  
  return clusters;
}

// Generate local fallback report if no LLM key is configured
function generateLocalBriefingContent(cluster, matches, date) {
  const mainItem = cluster.items[0];
  const matchedNames = matches.slice(0, 3).map(m => `${m.name} (${m.type})`).join(', ');
  
  const headline = `Beyond the Hype: The Real Implications of ${cluster.title}`;
  const coreArgument = `Many organizations treat ${cluster.title} as a plug-and-play solution, overlooking the fundamental trade-offs. The real challenge is not technological adoption, but aligning decision containment and systems architecture.`;
  
  const draft = {
    headline,
    argument: coreArgument,
    evidence: `In my past work on ${matches[0]?.name || 'systems design'}, this dynamic was key to shipping successful, long-term architecture.`,
    mentatLinks: [`https://www.mentatcommons.com/career#${matches[0]?.id || 'explorer'}`],
    hashtags: ['SystemsThinking', 'DecisionDesign', 'TechLeadership'],
    readingTime: '2 min'
  };

  return {
    title: cluster.title,
    summary: mainItem.description || mainItem.title,
    whyItMatters: `This conversation represents a shift in technical strategy. Keeping abreast of this allows us to align client implementations with industry direction.`,
    whyItMattersConsulting: `Provides an opportunity to counsel organizations on managing transitions related to ${cluster.title} using proven methodologies (e.g. ${matchedNames}).`,
    matchedEntities: matches.map(m => m.id),
    action: 'linkedin',
    linkedin: draft,
    confidence: 0.85,
    novelty: 0.70
  };
}

export async function processRadarBriefing(apiKey) {
  const date = new Date().toISOString().split('T')[0];
  console.log(`[Radar Engine] Running Radar Processing Pipeline for ${date}...`);
  
  const items = await getItems();
  const ckb = await loadCKB();
  
  // 1. Filter items from last 48 hours to focus on fresh content
  const freshItems = items.filter(item => {
    const pubDate = new Date(item.publishedAt || item.ingestedAt);
    const diff = (new Date() - pubDate) / (1000 * 60 * 60);
    return diff <= 48;
  });

  const itemsToProcess = freshItems.length > 0 ? freshItems : items.slice(0, 50);
  console.log(`  - Processing ${itemsToProcess.length} items...`);
  
  // 2. Cluster items
  const rawClusters = clusterItems(itemsToProcess);
  console.log(`  - Grouped items into ${rawClusters.length} discussion clusters.`);

  // 3. Rank and match against Career Evidence Graph (CEG)
  const scoredClusters = [];
  for (const cluster of rawClusters) {
    // Search CEG with cluster title to fetch overlapping matches
    const cegMatches = await searchCKB(cluster.title);
    
    // Sum matching scores to establish relevance
    const sumScore = cegMatches.slice(0, 3).reduce((acc, m) => acc + (m.score || 0), 0);
    
    if (cegMatches.length > 0 && sumScore > 0) {
      scoredClusters.push({
        cluster,
        cegMatches,
        score: sumScore
      });
    }
  }

  // Sort clusters descending by score
  scoredClusters.sort((a, b) => b.score - a.score);
  
  // Select top 3 relevant clusters
  const topClusters = scoredClusters.slice(0, 3);
  console.log(`  - Identified ${topClusters.length} top opportunities overlapping with expertise.`);

  const opportunities = [];
  
  for (const { cluster, cegMatches } of topClusters) {
    if (apiKey) {
      try {
        console.log(`  - Querying LLM for cluster: '${cluster.title}'...`);
        const systemPrompt = `You are a professional Conversation Radar Research Assistant.
Given a discussion cluster (with articles/posts) and a set of matched professional experiences/projects from the user's Career Evidence Graph, analyze the topic and output a JSON object.
Rules:
1. Do not invent experience. Rely strictly on the provided CKB matched entities.
2. Structure the JSON object with the following fields:
{
  "title": "Clean concise topic title",
  "summary": "Short paragraph summarizing the conversation and core debate",
  "whyItMatters": "Why this conversation is technically or organizationally significant",
  "whyItMattersConsulting": "How this relates to consulting services or client Advisory",
  "action": "linkedin | blog | workshop | research | ignore",
  "linkedin": {
    "headline": "A LinkedIn hook detailing the core tension or misconception",
    "argument": "The core systemic argument or trade-off",
    "evidence": "Briefly mention supporting evidence using matched CKB project details",
    "mentatLinks": ["https://www.mentatcommons.com/career#project-id"],
    "hashtags": ["Hashtag1", "Hashtag2"],
    "readingTime": "2 min"
  },
  "confidence": 0.85,
  "novelty": 0.70
}`;

        const userPrompt = `Discussion Topic: "${cluster.title}"
Feed Items:
${cluster.items.map((it, idx) => `[${idx+1}] Title: ${it.title} | Link: ${it.url}\nSummary: ${it.description}`).join('\n')}

Matched CEG Evidence:
${JSON.stringify(cegMatches.slice(0, 3).map(m => ({ id: m.id, type: m.type, name: m.name, data: m.data })))}`;

        const answerText = await callLLM(systemPrompt, userPrompt, apiKey);
        const cleanJson = answerText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanJson);
        
        opportunities.push({
          ...data,
          matchedEntities: cegMatches.map(m => m.id)
        });
      } catch (err) {
        console.error(`  - LLM failed for cluster '${cluster.title}', falling back to local:`, err.message);
        opportunities.push(generateLocalBriefingContent(cluster, cegMatches, date));
      }
    } else {
      opportunities.push(generateLocalBriefingContent(cluster, cegMatches, date));
    }
  }

  // 4. Update Long-Term Memory
  const memoryList = await getMemory();
  const memoryMap = new Map(memoryList.map(m => [m.topicName.toLowerCase(), m]));
  
  opportunities.forEach(opp => {
    const nameKey = opp.title.toLowerCase();
    if (memoryMap.has(nameKey)) {
      const existing = memoryMap.get(nameKey);
      existing.occurrenceCount += 1;
      existing.lastSeen = date;
    } else {
      memoryMap.set(nameKey, {
        id: 'mem-' + Math.random().toString(36).substring(2, 9),
        topicName: opp.title,
        firstSeen: date,
        lastSeen: date,
        occurrenceCount: 1,
        notes: `Intersects with capabilities: ${opp.whyItMattersConsulting}`
      });
    }
  });

  await saveMemory(Array.from(memoryMap.values()));

  // 5. Structure Briefing
  const briefing = {
    date,
    opportunities,
    themes: Array.from(memoryMap.values()).filter(m => m.occurrenceCount > 1).slice(0, 5),
    consulting: opportunities.map(o => ({
      topic: o.title,
      entryPoint: o.whyItMattersConsulting
    })),
    researchQuestions: [
      `How does the adoption of ${opportunities[0]?.title || 'AI systems'} affect local decision containment processes?`,
      `What are the hidden architectural trade-offs of deploying ${opportunities[1]?.title || 'distributed modules'} at edge runtimes?`
    ],
    contentIdeas: opportunities.map(o => `Draft a deep-dive essay on ${o.title} referencing your implementation outcomes in ${o.matchedEntities[0] || 'past work'}.`)
  };

  await saveBriefing(briefing);
  console.log(`[Radar Engine] Briefing for ${date} successfully generated.`);
  return briefing;
}
