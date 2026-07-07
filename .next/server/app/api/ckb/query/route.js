"use strict";(()=>{var e={};e.id=447,e.ids=[447],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},629:e=>{e.exports=require("fs/promises")},5315:e=>{e.exports=require("path")},3262:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>g,patchFetch:()=>h,requestAsyncStorage:()=>p,routeModule:()=>d,serverHooks:()=>m,staticGenerationAsyncStorage:()=>u});var a={};i.r(a),i.d(a,{POST:()=>l});var n=i(9303),r=i(8716),o=i(670),s=i(9045);function c(e,t){let i=t.filter(e=>"experience"===e.type).map(e=>e.data),a=t.filter(e=>"project"===e.type).map(e=>e.data);t.filter(e=>"skill"===e.type).map(e=>e.data);let n=`# TAILORED PROFESSIONAL RESUME

`;n+=`*Generated based on Target Job Description constraints and verified CKB evidence.*

## Professional Summary
Systems Architect, Decision Designer, and Facilitator with over 6 years of experience operating at the intersection of technical workflows and human systems. Expert in designing data pipelines, deploying edge AI systems, and conducting algorithmic audits. Skilled in facilitating decision labs and utilizing applied improvisation for cross-functional alignment. **[Sources: exp-mentat-commons, exp-bene-data]**

## Areas of Expertise
- **Technical Strategy & MLOps:** End-to-end data pipeline design, edge computer vision, model drift monitoring. **[Sources: proj-smart-waste, exp-bene-data]**
- **Decision Systems & Org Design:** Information flow mapping, metrics alignment, decision rights optimization. **[Sources: exp-mentat-commons]**
- **Human Systems & Facilitation:** Applied improvisation, restorative dialogue circles, experiential curriculum design. **[Sources: exp-mentat-theatre, comm-restorative-justice]**

## Professional Experience

`,(i.length>0?i:[]).forEach(e=>{n+=`### ${e.role} | ${e.organization} 
*${e.start_date} - ${e.end_date} | Domains: ${(e.domains||[]).join(", ")}*

`,e.responsibilities.forEach((t,i)=>{n+=`- ${t} **[Source: ${e.id}]**
`}),e.leadership_examples&&e.leadership_examples.length>0&&(n+=`- **Leadership Highlight:** ${e.leadership_examples[0]} **[Source: ${e.id}]**
`),n+=`
`}),n+=`## Highlighted Projects & Case Studies

`;let r=a.length>0?a:[];r.forEach(e=>{n+=`### ${e.title}
*Organization: ${e.organization} | Axes: ${e.axes.map(e=>e.replace("-"," ")).join(", ")}*

- **Problem:** ${e.problem} **[Source: ${e.id}]**
- **Solution:** ${e.solution} **[Source: ${e.id}]**
- **Architecture:** ${e.architecture||""} **[Source: ${e.id}]**
- **Decisions & Trade-offs:** Choice: ${e.decisions} (Trade-off: ${e.tradeoffs}) **[Source: ${e.id}]**
- **Impact:** ${(e.impact||[]).join("; ")} **[Source: ${e.id}]**

`});let o=`# TAILORED COVER LETTER

`;o+=`Dear Hiring Manager,

I am writing to express my strong interest in collaborating with your team. Having reviewed the role's requirements, I am confident that my background in designing decision systems, data architecture, and cross-functional facilitation matches the challenges you are addressing.

`;let s=e.toLowerCase().includes("rust")||e.toLowerCase().includes("wasm")||e.toLowerCase().includes("simulation")||e.toLowerCase().includes("game theory");s&&a.some(e=>"proj-axelrod"===e.id)?o+=`Throughout my career, I have operated under a core guiding principle: *never rewrite history; reorganize and retrieve it.* In my recent work at **Mentat Commons**, I built **Axelrod's Razor**, an interactive spatial simulation sandbox studying evolutionary game theory. I implemented a core simulation engine in Rust, compiled to WebAssembly, to handle 10,000+ spatial agent updates in real-time at 60 FPS in-browser. This project embodies my approach to using interactive modeling to make complex collective decision dynamics tangible. **[Sources: proj-axelrod, exp-mentat-commons]**

`:o+=`Throughout my career, I have operated under a core guiding principle: *never rewrite history; reorganize and retrieve it.* In my previous work at **Mentat Commons** and **Bene Data Collective**, I focused on treating AI, data, and learning systems as decision infrastructure rather than standalone features. For instance, in the **Smart Waste Detection System**, I designed an edge computer vision pipeline running on Raspberry Pi and GPU platforms, optimizing performance locally to address spotty connectivity constraints. **[Sources: proj-smart-waste, exp-bene-data]**

`,o+=`Additionally, my work with **Mentat Theatre** and community restorative justice circles has taught me that the hardest problems in technology are rarely just technical; they are human coordination problems. By designing **Decision & Learning Labs**, I have coached over 120 product managers and engineers on slow-down decision points and assumption testing, resulting in a 40% reduction in stalled project cycles. **[Sources: proj-decision-labs, exp-mentat-theatre]**

I welcome the opportunity to discuss how my experience in systems thinking, algorithmic auditing, and collective decision design can support your strategic initiatives. Thank you for your time and consideration.

Sincerely,
Nandhini Anand
`;let c=`# BEHAVIORAL INTERVIEW EXAMPLES (STAR)

`;r.forEach(e=>{c+=`### Challenge: ${e.title} **[Source: ${e.id}]**

* **Situation (S):** ${e.context} The organization faced the challenge: ${e.problem}
* **Task (T):** We needed to develop a solution leveraging ${e.technologies.join(", ")} while navigating constraints.
* **Action (A):** I led the design and implementation. A key architectural decision was: ${e.decisions}. We balanced the trade-off: ${e.tradeoffs}.
* **Result (R):** Direct achievements included: ${(e.impact||[]).join("; ")}.

* **Interview Target Questions:** ${(e.interview_questions_supported||[]).join(" | ")}

`});let l=`# THE STORY BANK

`;l+=`*A repository of stories to draw upon, mapped to specific Career Axes.*

`,a.length>0&&a.forEach(e=>{l+=`### Story: The ${e.title} Trade-off **[Source: ${e.id}]**
* **Focus:** Technical Strategy, Systems Performance & Decision Optimality
* **Narrative Arc:** We were building the ${e.title}. There was pressure to use generic cloud models or pure JavaScript interfaces. However, I diagnosed that connectivity, API costs, or frame rate drops would impact decision usefulness. I decided to make the key choice: ${e.decisions}. While it carried tradeoffs: ${e.tradeoffs}, it unlocked major outcomes: ${(e.impact||[]).join(", ")}. This shows how choosing interpretability and operational usefulness over complexity leads to durable systems.
* **Key Lesson:** Decisions must come before models.

`});let d=`# SKILLS GAP ANALYSIS

`;d+=`*Comparing the target Job Description against the canonical Career Knowledge Base.*

### Matched Strengths (Fully Documented)
- **Python & Systems Engineering:** 6 years of proven experience building data pipelines and custom libraries. **[Sources: skills-python]**
- **Systems Design & Decision Dynamics:** Verified experience designing decision loops, diagnostics, and metrics. **[Sources: exp-mentat-commons, proj-decision-labs]**
- **Cross-Functional Communication:** Verified experience facilitating collaboration labs and applied improvisation workshops. **[Sources: exp-mentat-theatre]**
`,s&&(d+=`- **High-Performance Simulation (Rust/Wasm):** Deployed agent-based models in-browser at 60 FPS. **[Sources: proj-axelrod]**
`),d+=`
### Potential Gaps & Bridging Strategies
`;let p=[];(e.toLowerCase().includes("aws")||e.toLowerCase().includes("cloud")||e.toLowerCase().includes("azure"))&&p.push({skill:"Cloud Platforms (AWS/Azure/GCP)",strategy:"While the CKB emphasizes edge computing (Raspberry Pi/Docker) and local optimization, bridge this gap by highlighting deployment pipelines, Docker containerization, and data integration principles which readily port to cloud orchestrators."}),(e.toLowerCase().includes("react")||e.toLowerCase().includes("typescript")||e.toLowerCase().includes("frontend"))&&p.push({skill:"Modern Frontend (React/Typescript)",strategy:"Highlight the next.js and frontend implementation details of Mentat Commons dashboard portals and interface design for modeling outputs."}),0===p.length&&p.push({skill:"Scale-focused Infrastructure",strategy:"Highlight how the database models and post-project synthesis documents ensure data contracts hold as the organization scales."}),p.forEach(e=>{d+=`* **Gap identified:** *${e.skill}*
  * **Bridging Strategy:** ${e.strategy}

`});let u=`# INTERVIEW PREPARATION NOTES

`;return u+=`### Core Elevator Pitch (Career Axes Integration)
"I operate at the intersection of technical systems, decision design, and human communication. My career is structured around three vectors: Technical Leadership (ML pipelines), Human Systems (facilitation and training), and Decision Systems (cognitive models). I treat AI and data as organizational infrastructure, ensuring models change decision behavior rather than just sitting in dashboards."

### Key Talking Points & Metrics to Mention:
`,a.forEach(e=>{u+=`- **${e.title}:** Achieved: ${(e.impact||[]).join(", ")} **[Source: ${e.id}]**
`}),i.forEach(e=>{e.leadership_examples&&e.leadership_examples.forEach(t=>{u+=`- **Leadership Story:** ${t} **[Source: ${e.id}]**
`})}),{resume:n,coverLetter:o,star:c,storyBank:l,skillsGap:d,interviewPrep:u}}async function l(e){try{let{action:t,query:i,question:a,jobDescription:n,apiKey:r}=await e.json(),o=r||process.env.OPENAI_API_KEY||process.env.GEMINI_API_KEY||(process.env.OLLAMA_MODEL?"ollama":null)||(process.env.CLOUDFLARE_API_TOKEN?"cloudflare":null);if("query"===t){let e=i||"",t=await (0,s.Eq)(e);if(o){let i=`You are a professional Career RAG Assistant. 
Your goal is to answer the user's question about their career history using ONLY the provided canonical Career Knowledge Base data.
Rules:
1. Never invent or hallucinate any experience. If the data does not support a claim, do not make it.
2. Every claim or bullet point MUST be traceable. You must append the source identifier, e.g. [Source: exp-mentat-commons] or [Source: proj-smart-waste], directly after the sentence.
3. Be concise and professional.
4. Structure your response using clear markdown headings and bullet points.

Canonical Career Data Context:
${JSON.stringify(t.slice(0,5).map(e=>({type:e.type,id:e.id,name:e.name,data:e.data})))}`,a=`Question: "${e}"`;try{let e=await (0,s.wI)(i,a,o);return new Response(JSON.stringify({answer:e,matches:t.slice(0,6)}),{status:200,headers:{"Content-Type":"application/json"}})}catch(a){console.error(`LLM RAG query failed (falling back to local): ${a.message}`);let i=(0,s.f9)(e,t);return new Response(JSON.stringify({answer:i,matches:t.slice(0,6),warning:"LLM generation failed, showing local synthesis."}),{status:200,headers:{"Content-Type":"application/json"}})}}else{let i=(0,s.f9)(e,t);return new Response(JSON.stringify({answer:i,matches:t.slice(0,6)}),{status:200,headers:{"Content-Type":"application/json"}})}}else if("interview"===t){let e=a||"",t=await (0,s.Eq)(e);if(o){let i=`You are an Interview Prep Assistant.
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
${JSON.stringify(t.slice(0,5).map(e=>({type:e.type,id:e.id,name:e.name,data:e.data})))}`,a=`Interview Question: "${e}"`;try{let e=(await (0,s.wI)(i,a,o)).replace(/```json/g,"").replace(/```/g,"").trim(),n=JSON.parse(e);return new Response(JSON.stringify({structure:n,matches:t.slice(0,5)}),{status:200,headers:{"Content-Type":"application/json"}})}catch(a){console.error(`LLM Interview prep failed (falling back to local): ${a.message}`);let i=(0,s.yl)(e,t);return new Response(JSON.stringify({structure:i,matches:t.slice(0,5),warning:"LLM generation failed, showing local synthesis."}),{status:200,headers:{"Content-Type":"application/json"}})}}else{let i=(0,s.yl)(e,t);return new Response(JSON.stringify({structure:i,matches:t.slice(0,5)}),{status:200,headers:{"Content-Type":"application/json"}})}}else if("generate"===t){let e=n||"",t=await (0,s.Eq)(e);if(o){let i=`You are a Career Documents Tailoring Assistant.
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
${JSON.stringify(t.slice(0,8).map(e=>({type:e.type,id:e.id,name:e.name,data:e.data})))}`,a=`Target Job Description:
${e}`;try{let e=(await (0,s.wI)(i,a,o)).replace(/```json/g,"").replace(/```/g,"").trim(),t=JSON.parse(e);return new Response(JSON.stringify(t),{status:200,headers:{"Content-Type":"application/json"}})}catch(a){console.error(`LLM Resume tailoring failed (falling back to local): ${a.message}`);let i=c(e,t);return new Response(JSON.stringify({...i,warning:"LLM generation failed, showing local synthesis."}),{status:200,headers:{"Content-Type":"application/json"}})}}else{let i=c(e,t);return new Response(JSON.stringify(i),{status:200,headers:{"Content-Type":"application/json"}})}}return new Response(JSON.stringify({error:"Invalid action"}),{status:400})}catch(e){return console.error("Error in ckb query route:",e),new Response(JSON.stringify({error:e.message}),{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/ckb/query/route",pathname:"/api/ckb/query",filename:"route",bundlePath:"app/api/ckb/query/route"},resolvedPagePath:"/mnt/data/playspace/mentat-commons/app/api/ckb/query/route.js",nextConfigOutput:"",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:u,serverHooks:m}=d,g="/api/ckb/query/route";function h(){return(0,o.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:u})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),a=t.X(0,[948,570],()=>i(3262));module.exports=a})();