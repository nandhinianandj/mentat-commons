import { loadCKB, searchCKB, callLLM } from './rag_ckb.mjs';

export function validateCitations(text, ckb) {
  const refRegex = /\[Ref:\s*([a-zA-Z0-9-_]+)\]/g;
  const verified = [];
  const unverified = [];
  let match;
  
  // Compile all valid CKB entity IDs
  const allIds = new Set();
  
  const addId = (id) => {
    if (!id) return;
    allIds.add(id);
    allIds.add(id.toLowerCase());
    // Also support common write- prefix variations
    if (id.startsWith('write-')) {
      allIds.add(id.substring(6));
      allIds.add(id.substring(6).toLowerCase());
    } else {
      allIds.add(`write-${id}`);
      allIds.add(`write-${id}`.toLowerCase());
    }
  };

  (ckb.experiences || []).forEach(e => addId(e.id));
  (ckb.projects || []).forEach(p => addId(p.id));
  (ckb.skills || []).forEach(s => addId(s.id));
  (ckb.talks || []).forEach(t => addId(t.id));
  (ckb.community || []).forEach(c => addId(c.id));
  
  if (ckb.writing) {
    Object.values(ckb.writing).forEach(list => {
      list.forEach(w => addId(w.id));
    });
  }

  while ((match = refRegex.exec(text)) !== null) {
    const id = match[1];
    if (allIds.has(id) || allIds.has(id.toLowerCase())) {
      verified.push(id);
    } else {
      unverified.push(id);
    }
  }

  return {
    truthful: unverified.length === 0,
    verifiedCitations: Array.from(new Set(verified)),
    unverifiedCitations: Array.from(new Set(unverified))
  };
}

// Generate local fallback artifact if no LLM key is configured
function generateLocalFallback(type, targetText, matches) {
  const dateStr = new Date().toISOString().split('T')[0];
  let md = `# Tailored Artifact: ${type.toUpperCase()}\n`;
  md += `*Generated locally via Evidence Engine (Static Fallback) — Date: ${dateStr}*\n\n`;
  
  md += `## Target Context / Objectives\n> ${targetText}\n\n`;
  
  md += `## 🌟 Matched Evidence Blocks\n`;
  md += `The engine searched the Career Evidence Graph and located the following supporting cases:\n\n`;

  matches.forEach(m => {
    md += `### [Ref: ${m.id}] ${m.name} (${m.type.toUpperCase()})\n`;
    if (m.data && m.data.summary) {
      md += `*   **Summary**: ${m.data.summary}\n`;
    }
    if (m.data && m.data.problem) {
      md += `*   **Problem**: ${m.data.problem}\n`;
      md += `*   **Solution**: ${m.data.solution}\n`;
    }
    if (m.data && m.data.outcomes) {
      md += `*   **Key Outcomes**:\n`;
      m.data.outcomes.forEach(out => {
        md += `    *   ${out}\n`;
      });
    }
    md += `\n`;
  });

  md += `---\n\n## 📝 Draft Layout & Outline\n`;
  
  if (type === 'resume') {
    md += `### Professional Experience Outline\n`;
    matches.filter(m => m.type === 'experience').forEach(m => {
      md += `*   **${m.data.role}** at **${m.data.organization}** (First: ${m.data.first_seen || m.data.date}, Last: ${m.data.last_seen || m.data.date}) [Ref: ${m.id}]\n`;
      m.data.responsibilities.slice(0, 3).forEach(r => md += `    - ${r}\n`);
    });
  } else if (type === 'cover_letter') {
    md += `Dear Hiring Team,\n\n`;
    md += `I am writing to express my interest, drawing from years of experience in interdisciplinary systems design. My background intersects technology, decision systems, and human organizations.\n\n`;
    const expMatch = matches.find(m => m.type === 'experience');
    const projMatch = matches.find(m => m.type === 'project');
    if (projMatch) {
      md += `Specifically, during my work on **${projMatch.name}** [Ref: ${projMatch.id}], I solved complex challenges aligning closely with your requirements: *"${projMatch.data.problem}"*. This project achieved the following outcome: *"${projMatch.data.outcomes?.[0] || 'successful deployment'}"*.\n\n`;
    }
    md += `Thank you for your consideration.\n`;
  } else if (type === 'interview_notes') {
    md += `### STAR Interview Stories\n\n`;
    matches.filter(m => m.type === 'project' || m.type === 'experience').slice(0, 2).forEach(m => {
      md += `#### Story: ${m.name} [Ref: ${m.id}]\n`;
      md += `*   **Situation**: ${m.data.context || m.data.summary}\n`;
      md += `*   **Task**: ${m.data.problem || 'Coordinate and architecture implementation'}\n`;
      md += `*   **Action**: ${m.data.solution || m.data.approach || 'Built and validated software systems'}\n`;
      md += `*   **Result**: ${m.data.outcomes?.join('. ') || 'Successfully met objectives'}\n\n`;
    });
  } else if (type === 'proposal') {
    md += `### Statement of Work Outline\n\n`;
    md += `1. **Problem Space Alignment**: Addressing target requirements via systems design.\n`;
    md += `2. **Methodology**: Applied improvisation workshops, decision containment audits, and evidence tracing.\n`;
    md += `3. **Relevant Past Cases**:\n`;
    matches.slice(0, 2).forEach(m => {
      md += `    *   **${m.name}** [Ref: ${m.id}]: ${m.data.summary || m.data.problem}\n`;
    });
  } else {
    md += `### Short Professional Biography\n`;
    md += `Nandhini Anand is a systems facilitation leader specializing in Technical Leadership, Decision Systems, and Human Coordination. Backed by projects like ${matches.slice(0, 2).map(m => `**${m.name}** [Ref: ${m.id}]`).join(' and ')}.\n`;
  }
  
  return md;
}

export async function compileArtifact(type, targetText, apiKey, options = {}) {
  console.log(`[Evidence Engine] Compiling ${type} artifact for target input...`);
  
  const ckb = await loadCKB();
  
  // 1. Retrieve most relevant nodes based on targetText
  const searchResults = await searchCKB(targetText);
  if (searchResults.length === 0) {
    console.warn("[Evidence Engine] No matching CKB evidence nodes found for prompt.");
  }
  
  // Sort and limit matched types
  const experiences = searchResults.filter(r => r.type === 'experience').slice(0, 3);
  const projects = searchResults.filter(r => r.type === 'project').slice(0, 3);
  const skills = searchResults.filter(r => r.type === 'skill').slice(0, 5);
  const writings = searchResults.filter(r => r.type === 'writing').slice(0, 3);
  
  const matches = [...experiences, ...projects, ...skills, ...writings];
  
  if (!apiKey) {
    console.log("[Evidence Engine] No LLM Key, falling back to local compiler...");
    return {
      artifact: generateLocalFallback(type, targetText, matches),
      citations: matches.map(m => m.id),
      validation: { truthful: true, verifiedCitations: matches.map(m => m.id), unverifiedCitations: [] }
    };
  }

  // 2. Load Prompt Template based on type
  let systemPrompt = '';
  let userPrompt = '';

  if (type === 'resume') {
    systemPrompt = `You are a professional Resume Compiler.
Generate a tailored Resume in Markdown based ONLY on the provided Career Knowledge Base (CKB) experiences, projects, and skills.
Rules:
1. Do not invent any companies, projects, tools, or employment dates. Rely strictly on the provided JSON data.
2. Structure the resume cleanly: Summary, Experience, Key Projects, and Technical Skills.
3. Tailor the emphasis to match the requirements in the provided Target Job Description.
4. CRITICAL: Every project highlight or work experience description MUST end with a citation tag referencing its source CKB ID in the format '[Ref: id]' (e.g. [Ref: proj-smart-waste] or [Ref: exp-mentat-commons]). Ensure every single bullet point is verified.`;
  } else if (type === 'cover_letter') {
    systemPrompt = `You are a professional Cover Letter Compiler.
Generate a tailored Cover Letter in Markdown addressing the provided Target Job Description.
Rules:
1. Ground every claim of capability in specific projects or experiences from the provided CKB.
2. Structure the letter with formal headers, introduction, bridging evidence, and closing.
3. Every project or experience cited must immediately append its source CKB ID in the format '[Ref: id]'.
4. Maintain a thoughtful, calm, and professional tone. Avoid marketing buzzwords.`;
  } else if (type === 'interview_notes') {
    systemPrompt = `You are an Interview Prep Coach.
Generate detailed STAR (Situation, Task, Action, Result) interview notes in Markdown based on the provided CKB experiences.
Answer behavioral categories (Leadership, Mentorship, Ambiguity, Failure, Technical scaling).
Rules:
1. Structure each story in clear STAR blocks.
2. Do not fabricate results, metrics, or contexts.
3. Append citation tags '[Ref: id]' to each story block.`;
  } else if (type === 'proposal') {
    systemPrompt = `You are a Consulting Proposal Writer.
Generate a professional, structured Statement of Work (SOW) / Consulting Proposal in Markdown addressing the client's problem statement.
Sections: Executive Summary, Proposed Solution Scope, Capabilities & past cases, Milestones/Timeline, and Estimating Framework.
Rules:
1. Support proposed advisory solutions with actual projects and writing from the provided CKB.
2. Cite all referenced CKB case studies with '[Ref: id]'.
3. Maintain a technical, collaborative, and evidence-backed tone.`;
  } else {
    // bio
    systemPrompt = `You are a Speaker Bio Generator.
Generate three tailored biographies (Short - 100 words, Medium - 250 words, Long - 500 words) in Markdown tailored to the target theme/audience.
Rules:
1. Rely only on the provided CKB achievements, talks, and writing.
2. Tailor bios to reinforce the 3 Career Axes: Technical Leadership, Human Systems, and Decision Systems.
3. Append citation references '[Ref: id]' for every talk or article cited.`;
  }

  userPrompt = `Target Requirement / Context:
"${targetText}"

Matched CKB Evidence:
${JSON.stringify(matches.map(m => ({ id: m.id, type: m.type, name: m.name, data: m.data })), null, 2)}`;

  try {
    const rawOutput = await callLLM(systemPrompt, userPrompt, apiKey);
    
    // 3. Post-Process Validation
    const validation = validateCitations(rawOutput, ckb);
    
    return {
      artifact: rawOutput,
      citations: validation.verifiedCitations,
      validation
    };
  } catch (err) {
    console.error(`[Evidence Engine] LLM compilation failed, falling back:`, err.message);
    return {
      artifact: generateLocalFallback(type, targetText, matches),
      citations: matches.map(m => m.id),
      validation: { truthful: true, verifiedCitations: matches.map(m => m.id), unverifiedCitations: [] }
    };
  }
}
