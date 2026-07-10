import fs from 'fs/promises';
import path from 'path';
import { compileArtifact } from '../lib/evidence_engine.mjs';

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

function getArg(flag) {
  const args = process.argv.slice(2);
  const index = args.findIndex(arg => arg.startsWith(flag));
  if (index === -1) return null;
  if (args[index].includes('=')) {
    return args[index].split('=')[1];
  }
  return args[index + 1];
}

async function run() {
  console.log(`${BOLD}=====================================================${RESET}`);
  console.log(`${BOLD}              MENTAT COMMONS EVIDENCE COMPILER       ${RESET}`);
  console.log(`${BOLD}=====================================================${RESET}\n`);

  const type = getArg('--type');
  const inputPath = getArg('--input');
  const outputPath = getArg('--output');

  if (!type || !inputPath || !outputPath) {
    console.error(`${RED}Error: Missing required arguments.${RESET}`);
    console.log(`Usage:\n  node scripts/compile-artifact.mjs --type=[resume|cover_letter|interview_notes|proposal|bio] --input=[input_file.txt] --output=[output_file.md]\n`);
    process.exit(1);
  }

  try {
    // 1. Read input target file
    const resolvedInputPath = path.resolve(inputPath);
    console.log(`  - Reading target constraint file: ${resolvedInputPath}...`);
    const targetText = await fs.readFile(resolvedInputPath, 'utf-8');

    // 2. Resolve API key
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || (process.env.OLLAMA_MODEL ? 'ollama' : null) || (process.env.CLOUDFLARE_API_TOKEN ? 'cloudflare' : null);
    
    // 3. Compile Artifact
    const result = await compileArtifact(type, targetText, apiKey);
    
    // 4. Save Output
    const resolvedOutputPath = path.resolve(outputPath);
    await fs.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
    await fs.writeFile(resolvedOutputPath, result.artifact, 'utf-8');

    console.log(`\n${GREEN}${BOLD}✓ Artifact compiled successfully!${RESET}`);
    console.log(`Saved output to: ${resolvedOutputPath}\n`);
    
    // 5. Output Verification Report
    console.log(`${BOLD}--- PROVENANCE AUDIT REPORT ---${RESET}`);
    if (result.validation.truthful) {
      console.log(`${GREEN}Truthfulness Status: 100% VERIFIED${RESET}`);
    } else {
      console.log(`${RED}Truthfulness Status: WARNING (Unverified references found)${RESET}`);
      console.log(`${YELLOW}Unverified References: ${result.validation.unverifiedCitations.join(', ')}${RESET}`);
    }
    
    console.log(`${CYAN}Verified CKB Citations: ${result.validation.verifiedCitations.join(', ') || 'None'}${RESET}`);
    console.log(`${BOLD}-------------------------------${RESET}\n`);
    
  } catch (error) {
    console.error(`\n${RED}Error running Evidence Compiler:${RESET}`, error.message);
    process.exit(1);
  }
}

run();
