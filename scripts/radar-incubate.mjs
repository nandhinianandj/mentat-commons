import fs from 'fs/promises';
import path from 'path';
import { compileWeeklyReview } from '../lib/incubator_engine.mjs';

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

async function run() {
  console.log(`${BOLD}=====================================================${RESET}`);
  console.log(`${BOLD}             MENTAT COMMONS IDEA INCUBATOR           ${RESET}`);
  console.log(`${BOLD}=====================================================${RESET}\n`);

  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || (process.env.OLLAMA_MODEL ? 'ollama' : null) || (process.env.CLOUDFLARE_API_TOKEN ? 'cloudflare' : null);
    
    const review = await compileWeeklyReview(apiKey);
    const date = review.date;

    // Compile Markdown
    let md = `# Idea Incubator Weekly Review: ${date}\n\n`;
    
    md += `## 📈 Idea Lifecycle Transitions\n\n`;
    if (review.promotions.length === 0) {
      md += `*   No stage promotions detected this week.\n\n`;
    } else {
      review.promotions.forEach(p => {
        md += `*   **${p.title}** promoted to **${p.stage.toUpperCase()}** (Persistence: ${p.pScore}%, Alignment: ${p.aScore}%)\n`;
      });
      md += `\n`;
    }
    
    md += `## 🎯 Enduring Questions & Signature Themes\n\n`;
    if (review.themes.length === 0) {
      md += `*   No persistent themes found yet. Collect more evidence to promote ideas.\n\n`;
    } else {
      review.themes.forEach(t => {
        md += `### Theme: ${t.title}\n`;
        md += `*   **Deconstructive Question**: *"${t.question}"*\n`;
        md += `*   **CEG Project Alignments**: ${t.entities.map(id => `[${id}](file:///data/career_knowledge_base.json#${id})`).join(', ') || 'None'}\n\n`;
      });
    }
    
    md += `## 💼 Consulting Entry Points\n\n`;
    review.actions.forEach(a => {
      md += `*   **${a.title}** (Persistence: ${a.score}%)\n`;
      md += `    *   *Recommended Actions*: ${a.actions.map(act => act.toUpperCase()).join(', ')}\n`;
    });
    
    md += `\n## 💡 Seed Concepts Discovered\n\n`;
    if (review.newSeeds.length === 0) {
      md += `*   No new seeds discovered.\n`;
    } else {
      review.newSeeds.forEach(s => {
        md += `*   ${s}\n`;
      });
    }

    // Save to reviews directory
    const reviewsDir = path.join(process.cwd(), 'briefings', 'reviews');
    await fs.mkdir(reviewsDir, { recursive: true });
    const reviewFile = path.join(reviewsDir, `${date}.md`);
    await fs.writeFile(reviewFile, md, 'utf-8');

    console.log(`\n${GREEN}${BOLD}✓ Incubator review generated successfully!${RESET}`);
    console.log(`Saved report to: ${reviewFile}\n`);
    
    console.log(`${BOLD}--- STAGE PROMOTIONS ---${RESET}`);
    if (review.promotions.length === 0) {
      console.log('No promotions this week.');
    } else {
      review.promotions.forEach(p => {
        console.log(`- ${CYAN}${p.title}${RESET} ➔ ${GREEN}${p.stage.toUpperCase()}${RESET} (Alignment: ${p.aScore}%)`);
      });
    }
    
    console.log(`\n${BOLD}--- NEW SEED IDEAS ---${RESET}`);
    review.newSeeds.slice(0, 5).forEach(s => {
      console.log(`- ${YELLOW}${s}${RESET}`);
    });
    if (review.newSeeds.length > 5) console.log(`...and ${review.newSeeds.length - 5} more.`);

  } catch (error) {
    console.error(`\nError running Idea Incubator:`, error);
    process.exit(1);
  }
}

run();
