import fs from 'fs/promises';
import path from 'path';

const CKB_FILE = path.join(process.cwd(), 'data', 'career_knowledge_base.json');

export async function loadCKB() {
  try {
    const data = await fs.readFile(CKB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading Career Knowledge Base:', error);
    return { experiences: [], projects: [], skills: {}, talks: [], community: [], writing: { articles: [], essays: [], research_notes: [], stories: [], blog_posts: [], talk_proposals: [], white_papers: [] } };
  }
}

const GRAPH_FILE = path.join(process.cwd(), 'data', 'evidence_graph.json');

export async function loadGraph() {
  try {
    const data = await fs.readFile(GRAPH_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading Career Knowledge Graph:', error);
    return { nodes: [], edges: [] };
  }
}

// Helper to calculate term matching score
function calculateMatchScore(text, queryTerms) {
  if (!text) return 0;
  const lowerText = String(text).toLowerCase();
  let score = 0;
  
  queryTerms.forEach(term => {
    if (term.length < 2) return;
    
    // Check exact matches
    const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedTerm, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
    
    // Check partial matches or synonyms
    if (term === 'leadership' && (lowerText.includes('lead') || lowerText.includes('founder') || lowerText.includes('guided') || lowerText.includes('architected'))) {
      score += 3;
    }
    if (term === 'mentor' && (lowerText.includes('coached') || lowerText.includes('junior') || lowerText.includes('teaching') || lowerText.includes('mentor'))) {
      score += 4;
    }
    if (term === 'stakeholder' && (lowerText.includes('client') || lowerText.includes('municipal') || lowerText.includes('advocate') || lowerText.includes('leadership') || lowerText.includes('director'))) {
      score += 3;
    }
    if (term === 'healthcare' && (lowerText.includes('community') || lowerText.includes('justice') || lowerText.includes('restorative') || lowerText.includes('dialogue'))) {
      score += 5;
    }
    if (term === 'systems' && (lowerText.includes('dynamics') || lowerText.includes('pipeline') || lowerText.includes('design') || lowerText.includes('architecture'))) {
      score += 2;
    }
  });
  
  return score;
}

export async function searchCKB(query) {
  const ckb = await loadCKB();
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 0);
  
  const results = [];
  
  // 1. Search Experiences
  if (ckb.experiences) {
    ckb.experiences.forEach(exp => {
      let score = 0;
      score += calculateMatchScore(exp.organization, queryTerms) * 2;
      score += calculateMatchScore(exp.role, queryTerms) * 3;
      score += calculateMatchScore(exp.summary, queryTerms) * 2;
      score += calculateMatchScore((exp.domains || []).join(' '), queryTerms) * 3;
      score += calculateMatchScore(exp.responsibilities.join(' '), queryTerms);
      score += calculateMatchScore(exp.deliverables.join(' '), queryTerms);
      score += calculateMatchScore((exp.leadership_examples || []).join(' '), queryTerms) * 1.5;
      score += calculateMatchScore((exp.stakeholders || []).join(' '), queryTerms);
      score += calculateMatchScore(exp.outcomes.join(' '), queryTerms);
      
      // Explicit Axis boosting
      if (lowerQuery.includes('technical') || lowerQuery.includes('data') || lowerQuery.includes('ai') || lowerQuery.includes('ml') || lowerQuery.includes('architecture')) {
        if (exp.axes.includes('axis-i')) score += 5;
      }
      if (lowerQuery.includes('human') || lowerQuery.includes('mentor') || lowerQuery.includes('theatre') || lowerQuery.includes('facilitat') || lowerQuery.includes('train')) {
        if (exp.axes.includes('axis-ii')) score += 5;
      }
      if (lowerQuery.includes('decision') || lowerQuery.includes('systems') || lowerQuery.includes('cognitive') || lowerQuery.includes('think')) {
        if (exp.axes.includes('axis-iii')) score += 5;
      }
      
      if (score > 0) {
        results.push({ type: 'experience', score, data: exp, id: exp.id, name: `${exp.role} at ${exp.organization}` });
      }
    });
  }
  
  // 2. Search Projects
  if (ckb.projects) {
    ckb.projects.forEach(proj => {
      let score = 0;
      score += calculateMatchScore(proj.title, queryTerms) * 4;
      score += calculateMatchScore(proj.problem, queryTerms) * 2;
      score += calculateMatchScore(proj.context, queryTerms);
      score += calculateMatchScore(proj.solution, queryTerms) * 2;
      score += calculateMatchScore(proj.architecture, queryTerms) * 2;
      score += calculateMatchScore(proj.decisions, queryTerms) * 3;
      score += calculateMatchScore(proj.tradeoffs, queryTerms) * 2;
      score += calculateMatchScore(proj.technologies.join(' '), queryTerms);
      score += calculateMatchScore((proj.outcomes || []).join(' '), queryTerms) * 2;
      score += calculateMatchScore((proj.impact || []).join(' '), queryTerms) * 2;
      score += calculateMatchScore((proj.reusable_stories || []).join(' '), queryTerms) * 2;
      score += calculateMatchScore((proj.interview_questions_supported || []).join(' '), queryTerms) * 2;
      
      if (lowerQuery.includes('technical') || lowerQuery.includes('code') || lowerQuery.includes('architecture') || lowerQuery.includes('rust') || lowerQuery.includes('webassembly')) {
        if (proj.axes.includes('axis-i')) score += 5;
      }
      if (lowerQuery.includes('human') || lowerQuery.includes('learning') || lowerQuery.includes('workshop')) {
        if (proj.axes.includes('axis-ii')) score += 5;
      }
      if (lowerQuery.includes('decision') || lowerQuery.includes('systems') || lowerQuery.includes('cognitive') || lowerQuery.includes('game theory')) {
        if (proj.axes.includes('axis-iii')) score += 5;
      }
      
      if (score > 0) {
        results.push({ type: 'project', score, data: proj, id: proj.id, name: proj.title });
      }
    });
  }
  
  // 3. Search Skills
  if (ckb.skills) {
    Object.entries(ckb.skills).forEach(([skillName, skillData]) => {
      let score = 0;
      score += calculateMatchScore(skillName, queryTerms) * 4;
      
      if (skillData.categories) {
        Object.entries(skillData.categories).forEach(([catName, catData]) => {
          score += calculateMatchScore(catName, queryTerms) * 3;
          score += calculateMatchScore(catData.description, queryTerms);
        });
      }
      
      if (score > 0) {
        results.push({ type: 'skill', score, data: { name: skillName, ...skillData }, id: `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`, name: skillName });
      }
    });
  }
  
  // 4. Search Talks
  if (ckb.talks) {
    ckb.talks.forEach(talk => {
      let score = 0;
      score += calculateMatchScore(talk.topic, queryTerms) * 4;
      score += calculateMatchScore(talk.audience, queryTerms) * 2;
      score += calculateMatchScore(talk.abstract, queryTerms) * 2;
      score += calculateMatchScore(talk.lessons, queryTerms) * 2;
      
      if (score > 0) {
        results.push({ type: 'talk', score, data: talk, id: talk.id, name: talk.topic });
      }
    });
  }
  
  // 5. Search Community
  if (ckb.community) {
    ckb.community.forEach(comm => {
      let score = 0;
      score += calculateMatchScore(comm.name, queryTerms) * 4;
      score += calculateMatchScore((comm.volunteering || []).join(' '), queryTerms) * 2;
      score += calculateMatchScore((comm.theatre || []).join(' '), queryTerms) * 2;
      score += calculateMatchScore((comm.facilitation || []).join(' '), queryTerms) * 2;
      score += calculateMatchScore((comm.partnerships || []).join(' '), queryTerms) * 2;
      score += calculateMatchScore((comm.workshops || []).join(' '), queryTerms) * 2;
      score += calculateMatchScore((comm.organizing || []).join(' '), queryTerms) * 2;
      
      if (score > 0) {
        results.push({ type: 'community', score, data: comm, id: comm.id, name: comm.name });
      }
    });
  }
  
  // 6. Search Writing
  if (ckb.writing) {
    Object.entries(ckb.writing).forEach(([category, list]) => {
      if (!Array.isArray(list)) return;
      list.forEach(write => {
        let score = 0;
        score += calculateMatchScore(write.title, queryTerms) * 4;
        score += calculateMatchScore(category, queryTerms) * 3;
        score += calculateMatchScore(write.summary, queryTerms) * 2;
        score += calculateMatchScore(write.content, queryTerms) * 2;
        
        if (score > 0) {
          results.push({ type: 'writing', score, data: { ...write, category }, id: write.id, name: write.title });
        }
      });
    });
  }
  
  // Sort results by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

// Generate structured response locally when no LLM key is present
export function generateLocalRAGResponse(query, matches) {
  if (matches.length === 0) {
    return "I searched the Career Knowledge Base for your query, but could not find any directly matching experiences, projects, or writing that contain those keywords. Please try another query focused on systems thinking, technical leadership, applied improv, or data consulting.";
  }
  
  const topMatches = matches.slice(0, 3);
  let response = `### Synthesized Career Summary for: "${query}"\n\n`;
  response += `Based on the canonical Career Knowledge Base, here is the factual evidence supporting this capability:\n\n`;
  
  topMatches.forEach((match, idx) => {
    const item = match.data;
    if (match.type === 'project') {
      response += `#### ${idx + 1}. Project: ${item.title} (Trace ID: [${match.id}](file:///data/career_knowledge_base.json))\n`;
      response += `* **Context & Problem:** ${item.context} ${item.problem}\n`;
      response += `* **Solution & Architecture:** ${item.solution} Built using: ${item.architecture || 'standard architecture'}.\n`;
      response += `* **Key Decisions & Trade-offs:** ${item.decisions} Trade-off: ${item.tradeoffs}\n`;
      response += `* **Impact & Outcomes:** ${(item.impact || []).join('; ')}\n\n`;
    } else if (match.type === 'experience') {
      response += `#### ${idx + 1}. Experience: ${item.role} at ${item.organization} (Trace ID: [${match.id}](file:///data/career_knowledge_base.json))\n`;
      response += `* **Overview:** Worked in the domain of **${(item.domains || []).join(', ')}** (${item.start_date} - ${item.end_date}).\n`;
      response += `* **Key Responsibilities:** ${item.responsibilities.slice(0, 2).join(' ')}\n`;
      response += `* **Leadership Example:** ${(item.leadership_examples || [])[0] || 'Led data architecture design.'}\n`;
      response += `* **Outcomes:** ${item.outcomes.join('; ')}\n\n`;
    } else if (match.type === 'writing') {
      response += `#### ${idx + 1}. Writing: "${item.title}" (${item.category || 'document'}) (Trace ID: [${match.id}](file:///data/career_knowledge_base.json))\n`;
      response += `* **Summary:** ${item.summary}\n`;
      response += `* **Core Argument:** ${item.content || ''}\n\n`;
    } else if (match.type === 'community') {
      response += `#### ${idx + 1}. Applied/Community Work: ${item.name} (Trace ID: [${match.id}](file:///data/career_knowledge_base.json))\n`;
      response += `* **Facilitation & Workshops:** ${(item.workshops || []).join(' ')}\n`;
      response += `* **Community Organizing:** ${(item.organizing || []).join(' ')}\n\n`;
    } else if (match.type === 'talk') {
      response += `#### ${idx + 1}. Talk: "${item.topic}" (Trace ID: [${match.id}](file:///data/career_knowledge_base.json))\n`;
      response += `* **Audience & Context:** Delivered to ${item.audience} (${item.duration}).\n`;
      response += `* **Key Lesson:** ${item.lessons}\n\n`;
    } else {
      response += `#### ${idx + 1}. Skill: ${item.name} (Trace ID: [${match.id}](file:///data/career_knowledge_base.json))\n`;
      response += `* **Overview:** Structured competency in **${item.name}**.\n`;
      const categoriesText = Object.entries(item.categories || {}).map(([cName, cData]) => `**${cName}** (${cData.yearsOfExperience} yrs): ${cData.description}`).join('; ');
      response += `* **Details:** ${categoriesText}\n\n`;
    }
  });
  
  // Mapping to axes
  const relatedAxes = new Set();
  topMatches.forEach(match => {
    if (match.data.axes) {
      match.data.axes.forEach(axis => relatedAxes.add(axis));
    }
  });
  
  if (relatedAxes.size > 0) {
    response += `### Career Axes Alignment\n`;
    response += `This inquiry maps to the following professional vectors:\n`;
    relatedAxes.forEach(axis => {
      if (axis === 'axis-i') {
        response += `- **Axis I (Technical Leadership):** Demonstrating capability in AI, ML, systems architecture, and technical strategy.\n`;
      } else if (axis === 'axis-ii') {
        response += `- **Axis II (Human Systems):** Demonstrating training, facilitation, community building, and learning translation.\n`;
      } else if (axis === 'axis-iii') {
        response += `- **Axis III (Decision Systems):** Demonstrating skills at the intersection of technology, cognition, and collective organizational design.\n`;
      }
    });
  }
  
  return response;
}

// Generate STAR answer structure locally for Interview Mode
export function generateLocalSTARResponse(question, matches) {
  const projectMatches = matches.filter(m => m.type === 'project');
  const expMatches = matches.filter(m => m.type === 'experience');
  
  const bestProjectMatch = projectMatches[0] || null;
  const bestExpMatch = expMatches[0] || null;
  
  if (!bestProjectMatch && !bestExpMatch) {
    return {
      error: "No matching project or experience found to construct an interview response. Please refine your query."
    };
  }
  
  const coreItem = bestProjectMatch ? bestProjectMatch.data : bestExpMatch.data;
  const traceId = bestProjectMatch ? bestProjectMatch.id : bestExpMatch.id;
  const coreName = bestProjectMatch ? coreItem.title : coreItem.organization;
  
  // Build STAR components
  let situation = "";
  let task = "";
  let action = "";
  let result = "";
  let supportingEvidence = [];
  
  if (bestProjectMatch) {
    const p = bestProjectMatch.data;
    situation = `While working on ${p.title} (${p.context}), the core challenge was: ${p.problem}`;
    task = `We needed to design and implement a solution under constraints, specifically addressing key technical and operational requirements: ${p.solution}`;
    action = `I made the critical decision to: ${p.decisions}. This involved careful trade-offs, namely: ${p.tradeoffs}. I utilized a stack consisting of ${p.technologies.join(', ')}.`;
    result = `As a direct outcome, we achieved: ${(p.impact || []).join(', ')}. This project also supports interview stories like: ${(p.reusable_stories || []).join('; ')}.`;
    supportingEvidence = (p.impact || []).concat(p.technologies);
  } else {
    const e = bestExpMatch.data;
    situation = `During my role as ${e.role} at ${e.organization} (${e.start_date} - ${e.end_date}), I operated in the domain of ${(e.domains || []).join(', ')}.`;
    task = `I was responsible for: ${e.responsibilities.slice(0, 2).join(' ')}`;
    action = `To address alignment and technical governance, I designed and executed: ${e.deliverables.slice(0, 2).join(' ')}. A key leadership example was: ${(e.leadership_examples || [])[0] || 'leading system audits'}.`;
    result = `This resulted in successful handovers and positive outcomes: ${e.outcomes.join(', ')}. Stakeholders managed included ${e.stakeholders.join(', ')}.`;
    supportingEvidence = e.outcomes.concat(e.deliverables);
  }
  
  const structure = {
    bestProject: coreName,
    traceId: traceId,
    supportingEvidence: supportingEvidence,
    similarExamples: matches.slice(1, 4).map(m => `${m.name} (${m.type}) [ID: ${m.id}]`),
    situation,
    task,
    action,
    result
  };
  
  return structure;
}

// Global LLM Call Wrapper
export async function callLLM(systemPrompt, userPrompt, apiKey) {
  const isOllama = apiKey === 'ollama' || (!apiKey && process.env.OLLAMA_MODEL);
  
  if (isOllama) {
    const model = process.env.OLLAMA_MODEL || 'llama3';
    const baseUrl = process.env.OLLAMA_API_BASE || 'http://localhost:11434';
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        options: {
          temperature: 0.2
        }
      })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama API Error: ${errText}`);
    }
    
    const result = await response.json();
    return result.message?.content || '';
  }

  const isCloudflare = apiKey === 'cloudflare' || (!apiKey && process.env.CLOUDFLARE_API_TOKEN);
  
  if (isCloudflare) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN || apiKey;
    const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/meta/llama-3-8b-instruct';
    
    if (!accountId) {
      throw new Error("Cloudflare Account ID (CLOUDFLARE_ACCOUNT_ID) is required for Workers AI.");
    }
    if (!apiToken || apiToken === 'cloudflare') {
      throw new Error("Cloudflare API Token (CLOUDFLARE_API_TOKEN) is required for Workers AI.");
    }
    
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudflare Workers AI Error: ${errText}`);
    }
    
    const result = await response.json();
    return result.result?.response || '';
  }

  if (!apiKey) {
    throw new Error("API Key not found.");
  }
  
  const isGemini = apiKey.startsWith("AIza");
  
  if (isGemini) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Request:\n${userPrompt}` }] }
        ],
        generationConfig: {
          temperature: 0.2
        }
      })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${errText}`);
    }
    
    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  } else {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2
      })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API Error: ${errText}`);
    }
    
    const result = await response.json();
    return result.choices[0].message.content;
  }
}
