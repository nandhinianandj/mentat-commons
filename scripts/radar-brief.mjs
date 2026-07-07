import fs from 'fs/promises';
import path from 'path';
import { ingestAll } from '../lib/radar_ingest.mjs';
import { processRadarBriefing } from '../lib/radar_engine.mjs';

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

async function run() {
  console.log(`${BOLD}=====================================================${RESET}`);
  console.log(`${BOLD}          MENTAT COMMONS CONVERSATION RADAR          ${RESET}`);
  console.log(`${BOLD}=====================================================${RESET}\n`);

  try {
    // 1. Run Ingestion
    await ingestAll();
    
    // 2. Run Engine Pipeline
    // Resolve key from env
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || (process.env.OLLAMA_MODEL ? 'ollama' : null) || (process.env.CLOUDFLARE_API_TOKEN ? 'cloudflare' : null);
    
    const briefing = await processRadarBriefing(apiKey);
    const date = briefing.date;

    // 3. Render Markdown
    let md = `# Conversation Radar: ${date}\n\n`;
    
    md += `## 🌟 Top Opportunities\n\n`;
    briefing.opportunities.forEach((opp, idx) => {
      md += `### ${opp.title}\n`;
      md += `*   **Summary**: ${opp.summary}\n`;
      md += `*   **Why it matters**: ${opp.whyItMatters}\n`;
      md += `*   **Why it matters to my consulting**: ${opp.whyItMattersConsulting}\n`;
      md += `*   **Relevant CEG Evidence**: ${opp.matchedEntities.map(id => `[${id}](file:///data/career_knowledge_base.json#${id})`).join(', ')}\n`;
      md += `*   **Suggested Action**: **${opp.action.toUpperCase()}**\n`;
      md += `*   **Metrics**: Confidence: ${Math.round(opp.confidence * 100)}%, Novelty: ${Math.round(opp.novelty * 100)}%\n\n`;
      
      if (opp.linkedin) {
        md += `#### 📝 Suggested LinkedIn Draft\n`;
        md += `*   **Headline**: ${opp.linkedin.headline}\n`;
        md += `*   **Core Argument**: ${opp.linkedin.argument}\n`;
        md += `*   **Supporting Evidence**: ${opp.linkedin.evidence}\n`;
        md += `*   **Hashtags**: ${opp.linkedin.hashtags.map(h => `#${h}`).join(' ')}\n`;
        md += `*   **Est. Read Time**: ${opp.linkedin.readingTime}\n\n`;
      }
      md += `---\n\n`;
    });

    md += `## 📈 Emerging Themes\n`;
    briefing.themes.forEach(t => {
      md += `*   **${t.topicName}**: Seen ${t.occurrenceCount} times (First: ${t.firstSeen}, Last: ${t.lastSeen})\n`;
    });
    md += `\n---\n\n`;

    md += `## 💼 Consulting Opportunities\n`;
    briefing.consulting.forEach(c => {
      md += `*   **${c.topic}**: Entry Point: ${c.entryPoint}\n`;
    });
    md += `\n---\n\n`;

    md += `## 🔬 Research Questions\n`;
    briefing.researchQuestions.forEach(q => {
      md += `*   ${q}\n`;
    });
    md += `\n---\n\n`;

    md += `## 💡 Content & Essay Ideas\n`;
    briefing.contentIdeas.forEach(i => {
      md += `*   ${i}\n`;
    });
    
    // Save to briefings folder
    const briefingsDir = path.join(process.cwd(), 'briefings');
    await fs.mkdir(briefingsDir, { recursive: true });
    const briefingFile = path.join(briefingsDir, `${date}.md`);
    await fs.writeFile(briefingFile, md, 'utf-8');

    // 4. Output to terminal
    console.log(`\n${GREEN}${BOLD}✓ Daily briefing generated successfully!${RESET}`);
    console.log(`Saved report to: ${briefingFile}\n`);
    
    console.log(`${BOLD}--- TOP OPPORTUNITIES ---${RESET}`);
    briefing.opportunities.forEach((o, i) => {
      console.log(`\n${BOLD}${i+1}. ${o.title}${RESET} [Relevance: ${Math.round(o.confidence * 100)}%]`);
      console.log(`${CYAN}Summary:${RESET} ${o.summary}`);
      console.log(`${YELLOW}Suggested Action:${RESET} ${o.action.toUpperCase()}`);
      if (o.linkedin) {
        console.log(`${GREEN}Draft Headline:${RESET} "${o.linkedin.headline}"`);
      }
    });

  } catch (error) {
    console.error(`\nError running Conversation Radar briefing:`, error);
    process.exit(1);
  }
}

run();
