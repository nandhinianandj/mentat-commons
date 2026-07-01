import { searchCKB, generateLocalRAGResponse, generateLocalSTARResponse, callLLM, loadCKB } from '../../../../lib/rag_ckb.mjs';

// Helper to generate local resume tailoring
function generateLocalResumeResponse(jd, matches) {
  const exps = matches.filter(m => m.type === 'experience').map(m => m.data);
  const projs = matches.filter(m => m.type === 'project').map(m => m.data);
  const skills = matches.filter(m => m.type === 'skill').map(m => m.data);
  
  // 1. Generate Resume
  let resume = `# TAILORED PROFESSIONAL RESUME\n\n`;
  resume += `*Generated based on Target Job Description constraints and verified CKB evidence.*\n\n`;
  resume += `## Professional Summary\n`;
  resume += `Systems Architect, Decision Designer, and Facilitator with over 6 years of experience operating at the intersection of technical workflows and human systems. Expert in designing data pipelines, deploying edge AI systems, and conducting algorithmic audits. Skilled in facilitating decision labs and utilizing applied improvisation for cross-functional alignment. **[Sources: exp-mentat-commons, exp-bene-data]**\n\n`;
  
  resume += `## Areas of Expertise\n`;
  resume += `- **Technical Strategy & MLOps:** End-to-end data pipeline design, edge computer vision, model drift monitoring. **[Sources: proj-smart-waste, exp-bene-data]**\n`;
  resume += `- **Decision Systems & Org Design:** Information flow mapping, metrics alignment, decision rights optimization. **[Sources: exp-mentat-commons]**\n`;
  resume += `- **Human Systems & Facilitation:** Applied improvisation, restorative dialogue circles, experiential curriculum design. **[Sources: exp-mentat-theatre, comm-restorative-justice]**\n\n`;
  
  resume += `## Professional Experience\n\n`;
  
  const displayExps = exps.length > 0 ? exps : [];
  displayExps.forEach(e => {
    resume += `### ${e.role} | ${e.organization} \n`;
    resume += `*${e.start_date} - ${e.end_date} | Domains: ${(e.domains || []).join(', ')}*\n\n`;
    e.responsibilities.forEach((r, idx) => {
      resume += `- ${r} **[Source: ${e.id}]**\n`;
    });
    if (e.leadership_examples && e.leadership_examples.length > 0) {
      resume += `- **Leadership Highlight:** ${e.leadership_examples[0]} **[Source: ${e.id}]**\n`;
    }
    resume += `\n`;
  });
  
  resume += `## Highlighted Projects & Case Studies\n\n`;
  const displayProjs = projs.length > 0 ? projs : [];
  displayProjs.forEach(p => {
    resume += `### ${p.title}\n`;
    resume += `*Organization: ${p.organization} | Axes: ${p.axes.map(a => a.replace('-', ' ')).join(', ')}*\n\n`;
    resume += `- **Problem:** ${p.problem} **[Source: ${p.id}]**\n`;
    resume += `- **Solution:** ${p.solution} **[Source: ${p.id}]**\n`;
    resume += `- **Architecture:** ${p.architecture || ''} **[Source: ${p.id}]**\n`;
    resume += `- **Decisions & Trade-offs:** Choice: ${p.decisions} (Trade-off: ${p.tradeoffs}) **[Source: ${p.id}]**\n`;
    resume += `- **Impact:** ${(p.impact || []).join('; ')} **[Source: ${p.id}]**\n\n`;
  });
  
  // 2. Generate Cover Letter
  let coverLetter = `# TAILORED COVER LETTER\n\n`;
  coverLetter += `Dear Hiring Manager,\n\n`;
  coverLetter += `I am writing to express my strong interest in collaborating with your team. Having reviewed the role's requirements, I am confident that my background in designing decision systems, data architecture, and cross-functional facilitation matches the challenges you are addressing.\n\n`;
  
  const hasRustKeywords = jd.toLowerCase().includes('rust') || jd.toLowerCase().includes('wasm') || jd.toLowerCase().includes('simulation') || jd.toLowerCase().includes('game theory');
  if (hasRustKeywords && projs.some(p => p.id === 'proj-axelrod')) {
    coverLetter += `Throughout my career, I have operated under a core guiding principle: *never rewrite history; reorganize and retrieve it.* In my recent work at **Mentat Commons**, I built **Axelrod's Razor**, an interactive spatial simulation sandbox studying evolutionary game theory. I implemented a core simulation engine in Rust, compiled to WebAssembly, to handle 10,000+ spatial agent updates in real-time at 60 FPS in-browser. This project embodies my approach to using interactive modeling to make complex collective decision dynamics tangible. **[Sources: proj-axelrod, exp-mentat-commons]**\n\n`;
  } else {
    coverLetter += `Throughout my career, I have operated under a core guiding principle: *never rewrite history; reorganize and retrieve it.* In my previous work at **Mentat Commons** and **Bene Data Collective**, I focused on treating AI, data, and learning systems as decision infrastructure rather than standalone features. For instance, in the **Smart Waste Detection System**, I designed an edge computer vision pipeline running on Raspberry Pi and GPU platforms, optimizing performance locally to address spotty connectivity constraints. **[Sources: proj-smart-waste, exp-bene-data]**\n\n`;
  }
  
  coverLetter += `Additionally, my work with **Mentat Theatre** and community restorative justice circles has taught me that the hardest problems in technology are rarely just technical; they are human coordination problems. By designing **Decision & Learning Labs**, I have coached over 120 product managers and engineers on slow-down decision points and assumption testing, resulting in a 40% reduction in stalled project cycles. **[Sources: proj-decision-labs, exp-mentat-theatre]**\n\n`;
  coverLetter += `I welcome the opportunity to discuss how my experience in systems thinking, algorithmic auditing, and collective decision design can support your strategic initiatives. Thank you for your time and consideration.\n\n`;
  coverLetter += `Sincerely,\n`;
  coverLetter += `Nandhini Anand\n`;
  
  // 3. Generate STAR Examples
  let star = `# BEHAVIORAL INTERVIEW EXAMPLES (STAR)\n\n`;
  displayProjs.forEach(p => {
    star += `### Challenge: ${p.title} **[Source: ${p.id}]**\n\n`;
    star += `* **Situation (S):** ${p.context} The organization faced the challenge: ${p.problem}\n`;
    star += `* **Task (T):** We needed to develop a solution leveraging ${p.technologies.join(', ')} while navigating constraints.\n`;
    star += `* **Action (A):** I led the design and implementation. A key architectural decision was: ${p.decisions}. We balanced the trade-off: ${p.tradeoffs}.\n`;
    star += `* **Result (R):** Direct achievements included: ${(p.impact || []).join('; ')}.\n\n`;
    star += `* **Interview Target Questions:** ${(p.interview_questions_supported || []).join(' | ')}\n\n`;
  });
  
  // 4. Generate Story Bank
  let storyBank = `# THE STORY BANK\n\n`;
  storyBank += `*A repository of stories to draw upon, mapped to specific Career Axes.*\n\n`;
  
  if (projs.length > 0) {
    projs.forEach(p => {
      storyBank += `### Story: The ${p.title} Trade-off **[Source: ${p.id}]**\n`;
      storyBank += `* **Focus:** Technical Strategy, Systems Performance & Decision Optimality\n`;
      storyBank += `* **Narrative Arc:** We were building the ${p.title}. There was pressure to use generic cloud models or pure JavaScript interfaces. However, I diagnosed that connectivity, API costs, or frame rate drops would impact decision usefulness. I decided to make the key choice: ${p.decisions}. While it carried tradeoffs: ${p.tradeoffs}, it unlocked major outcomes: ${(p.impact || []).join(', ')}. This shows how choosing interpretability and operational usefulness over complexity leads to durable systems.\n`;
      storyBank += `* **Key Lesson:** Decisions must come before models.\n\n`;
    });
  }
  
  // 5. Generate Skills Gap Analysis
  let skillsGap = `# SKILLS GAP ANALYSIS\n\n`;
  skillsGap += `*Comparing the target Job Description against the canonical Career Knowledge Base.*\n\n`;
  skillsGap += `### Matched Strengths (Fully Documented)\n`;
  skillsGap += `- **Python & Systems Engineering:** 6 years of proven experience building data pipelines and custom libraries. **[Sources: skills-python]**\n`;
  skillsGap += `- **Systems Design & Decision Dynamics:** Verified experience designing decision loops, diagnostics, and metrics. **[Sources: exp-mentat-commons, proj-decision-labs]**\n`;
  skillsGap += `- **Cross-Functional Communication:** Verified experience facilitating collaboration labs and applied improvisation workshops. **[Sources: exp-mentat-theatre]**\n`;
  if (hasRustKeywords) {
    skillsGap += `- **High-Performance Simulation (Rust/Wasm):** Deployed agent-based models in-browser at 60 FPS. **[Sources: proj-axelrod]**\n`;
  }
  skillsGap += `\n`;
  
  skillsGap += `### Potential Gaps & Bridging Strategies\n`;
  
  let gapItems = [];
  if (jd.toLowerCase().includes('aws') || jd.toLowerCase().includes('cloud') || jd.toLowerCase().includes('azure')) {
    gapItems.push({
      skill: "Cloud Platforms (AWS/Azure/GCP)",
      strategy: "While the CKB emphasizes edge computing (Raspberry Pi/Docker) and local optimization, bridge this gap by highlighting deployment pipelines, Docker containerization, and data integration principles which readily port to cloud orchestrators."
    });
  }
  if (jd.toLowerCase().includes('react') || jd.toLowerCase().includes('typescript') || jd.toLowerCase().includes('frontend')) {
    gapItems.push({
      skill: "Modern Frontend (React/Typescript)",
      strategy: "Highlight the next.js and frontend implementation details of Mentat Commons dashboard portals and interface design for modeling outputs."
    });
  }
  
  if (gapItems.length === 0) {
    gapItems.push({
      skill: "Scale-focused Infrastructure",
      strategy: "Highlight how the database models and post-project synthesis documents ensure data contracts hold as the organization scales."
    });
  }
  
  gapItems.forEach(item => {
    skillsGap += `* **Gap identified:** *${item.skill}*\n`;
    skillsGap += `  * **Bridging Strategy:** ${item.strategy}\n\n`;
  });
  
  // 6. Generate Interview Prep Notes
  let interviewPrep = `# INTERVIEW PREPARATION NOTES\n\n`;
  interviewPrep += `### Core Elevator Pitch (Career Axes Integration)\n`;
  interviewPrep += `"I operate at the intersection of technical systems, decision design, and human communication. My career is structured around three vectors: Technical Leadership (ML pipelines), Human Systems (facilitation and training), and Decision Systems (cognitive models). I treat AI and data as organizational infrastructure, ensuring models change decision behavior rather than just sitting in dashboards."\n\n`;
  
  interviewPrep += `### Key Talking Points & Metrics to Mention:\n`;
  projs.forEach(p => {
    interviewPrep += `- **${p.title}:** Achieved: ${(p.impact || []).join(', ')} **[Source: ${p.id}]**\n`;
  });
  exps.forEach(e => {
    if (e.leadership_examples) {
      e.leadership_examples.forEach(le => {
        interviewPrep += `- **Leadership Story:** ${le} **[Source: ${e.id}]**\n`;
      });
    }
  });
  
  return {
    resume,
    coverLetter,
    star,
    storyBank,
    skillsGap,
    interviewPrep
  };
}

export async function POST(req) {
  try {
    const { action, query, question, jobDescription, apiKey } = await req.json();
    
    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || (process.env.OLLAMA_MODEL ? 'ollama' : null) || (process.env.CLOUDFLARE_API_TOKEN ? 'cloudflare' : null);
    
    if (action === 'query') {
      const searchQuery = query || '';
      const matches = await searchCKB(searchQuery);
      
      if (effectiveApiKey) {
        const systemPrompt = `You are a professional Career RAG Assistant. 
Your goal is to answer the user's question about their career history using ONLY the provided canonical Career Knowledge Base data.
Rules:
1. Never invent or hallucinate any experience. If the data does not support a claim, do not make it.
2. Every claim or bullet point MUST be traceable. You must append the source identifier, e.g. [Source: exp-mentat-commons] or [Source: proj-smart-waste], directly after the sentence.
3. Be concise and professional.
4. Structure your response using clear markdown headings and bullet points.

Canonical Career Data Context:
${JSON.stringify(matches.slice(0, 5).map(m => ({ type: m.type, id: m.id, name: m.name, data: m.data })))}`;
        
        const userPrompt = `Question: "${searchQuery}"`;
        
        try {
          const answer = await callLLM(systemPrompt, userPrompt, effectiveApiKey);
          return new Response(JSON.stringify({ 
            answer, 
            matches: matches.slice(0, 6) 
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (llmErr) {
          console.error(`LLM RAG query failed (falling back to local): ${llmErr.message}`);
          const answer = generateLocalRAGResponse(searchQuery, matches);
          return new Response(JSON.stringify({ 
            answer, 
            matches: matches.slice(0, 6),
            warning: "LLM generation failed, showing local synthesis." 
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
      } else {
        const answer = generateLocalRAGResponse(searchQuery, matches);
        return new Response(JSON.stringify({ 
          answer, 
          matches: matches.slice(0, 6) 
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    } 
    
    else if (action === 'interview') {
      const interviewQuestion = question || '';
      const matches = await searchCKB(interviewQuestion);
      
      if (effectiveApiKey) {
        const systemPrompt = `You are an Interview Prep Assistant.
Given the user's behavioral/situational interview question, retrieve the best-matching projects/experiences from the provided context and construct a structured answer in the STAR format (Situation, Task, Action, Result).
Rules:
1. Only use real data from the provided Career Knowledge Base. No hallucinated experience.
2. For each section of the STAR answer, append source trace IDs, e.g. [Source: proj-smart-waste].
3. Suggest a best matching project, a list of supporting evidence, and other similar examples.
4. Provide the output in JSON format matching this structure:
{
  "bestProject": "Project Name",
  "traceId": "project-or-experience-id",
  "supportingEvidence": ["evidence 1", "evidence 2"],
  "similarExamples": ["Example 1", "Example 2"],
  "situation": "Situation content...",
  "task": "Task content...",
  "action": "Action content...",
  "result": "Result content..."
}
Do not include markdown code block styling in the JSON response, return raw JSON only.

Canonical Career Data Context:
${JSON.stringify(matches.slice(0, 5).map(m => ({ type: m.type, id: m.id, name: m.name, data: m.data })))}`;

        const userPrompt = `Interview Question: "${interviewQuestion}"`;
        
        try {
          const answerText = await callLLM(systemPrompt, userPrompt, effectiveApiKey);
          const cleanJsonText = answerText.replace(/```json/g, '').replace(/```/g, '').trim();
          const structure = JSON.parse(cleanJsonText);
          return new Response(JSON.stringify({ structure, matches: matches.slice(0, 5) }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.error(`LLM Interview prep failed (falling back to local): ${err.message}`);
          const structure = generateLocalSTARResponse(interviewQuestion, matches);
          return new Response(JSON.stringify({ structure, matches: matches.slice(0, 5), warning: "LLM generation failed, showing local synthesis." }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } else {
        const structure = generateLocalSTARResponse(interviewQuestion, matches);
        return new Response(JSON.stringify({ structure, matches: matches.slice(0, 5) }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } 
    
    else if (action === 'generate') {
      const jd = jobDescription || '';
      const matches = await searchCKB(jd);
      
      if (effectiveApiKey) {
        const systemPrompt = `You are a Career Documents Tailoring Assistant.
Your task is to analyze the user's target Job Description (JD) and their Career Knowledge Base (CKB) context, and generate a tailored Resume, Cover Letter, STAR Examples, Story Bank, Skills Gap Analysis, and Interview Prep Notes.
Rules:
1. Every generated experience bullet, summary, and letter sentence MUST trace back to actual evidence inside the CKB. Never invent experiences or skills.
2. Append source identifiers (e.g. [Source: proj-solar-optimization], [Source: exp-bene-data]) to all bullets in the Resume and claims in the Cover Letter.
3. Keep the output highly professional, using strong action verbs.
4. Output must be a JSON object containing the following keys:
{
  "resume": "Tailored Resume markdown string",
  "coverLetter": "Tailored Cover Letter markdown string",
  "star": "STAR Examples markdown string",
  "storyBank": "Story Bank markdown string",
  "skillsGap": "Skills Gap Analysis markdown string",
  "interviewPrep": "Interview Prep Notes markdown string"
}
Do not include markdown code block styling in the JSON response, return raw JSON only.

Canonical Career Data Context:
${JSON.stringify(matches.slice(0, 8).map(m => ({ type: m.type, id: m.id, name: m.name, data: m.data })))}`;

        const userPrompt = `Target Job Description:\n${jd}`;
        
        try {
          const answerText = await callLLM(systemPrompt, userPrompt, effectiveApiKey);
          const cleanJsonText = answerText.replace(/```json/g, '').replace(/```/g, '').trim();
          const data = JSON.parse(cleanJsonText);
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.error(`LLM Resume tailoring failed (falling back to local): ${err.message}`);
          const data = generateLocalResumeResponse(jd, matches);
          return new Response(JSON.stringify({ ...data, warning: "LLM generation failed, showing local synthesis." }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } else {
        const data = generateLocalResumeResponse(jd, matches);
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
  } catch (error) {
    console.error("Error in ckb query route:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
