import fs from 'fs/promises';
import path from 'path';

const CKB_FILE = path.join(process.cwd(), 'data', 'career_knowledge_base.json');
const SCHEMA_FILE = path.join(process.cwd(), 'data', 'schema.json');
const LOCALE_FILE = path.join(process.cwd(), 'locales', 'en.json');

// Color helpers
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let failed = false;

function logSuccess(message) {
  console.log(`${GREEN}✓ ${message}${RESET}`);
}

function logWarning(message) {
  console.log(`${YELLOW}⚠ ${message}${RESET}`);
}

function logError(message) {
  console.log(`${RED}✗ ${message}${RESET}`);
  failed = true;
}

// Custom deep type-checking validator
function checkType(val, expectedType, pathName) {
  if (expectedType === 'array') {
    if (!Array.isArray(val)) {
      logError(`Field '${pathName}' is expected to be an Array, got ${typeof val}`);
      return false;
    }
  } else if (typeof val !== expectedType) {
    logError(`Field '${pathName}' is expected to be a ${expectedType}, got ${typeof val}`);
    return false;
  }
  return true;
}

async function validate() {
  console.log(`${BOLD}Running Career Knowledge Base (CKB) Validation...${RESET}\n`);

  // 1. Load Files
  let ckb, schema, locale;
  try {
    const ckbRaw = await fs.readFile(CKB_FILE, 'utf-8');
    ckb = JSON.parse(ckbRaw);
    logSuccess('Loaded career_knowledge_base.json successfully.');
  } catch (err) {
    logError(`Failed to load or parse career_knowledge_base.json: ${err.message}`);
    process.exit(1);
  }

  try {
    const schemaRaw = await fs.readFile(SCHEMA_FILE, 'utf-8');
    schema = JSON.parse(schemaRaw);
    logSuccess('Loaded schema.json successfully.');
  } catch (err) {
    logError(`Failed to load or parse schema.json: ${err.message}`);
  }

  try {
    const localeRaw = await fs.readFile(LOCALE_FILE, 'utf-8');
    locale = JSON.parse(localeRaw);
    logSuccess('Loaded locales/en.json successfully.');
  } catch (err) {
    logError(`Failed to load or parse locales/en.json: ${err.message}`);
  }

  if (failed) process.exit(1);

  // Collect all valid IDs for referential integrity checking
  const validIds = new Set();
  const validProjects = new Set();
  const validExperiences = new Set();
  const validAxes = new Set(['axis-i', 'axis-ii', 'axis-iii']);

  // 2. Validate Experiences
  console.log(`\n${BOLD}[1/5] Validating Experiences...${RESET}`);
  if (!checkType(ckb.experiences, 'array', 'experiences')) return;
  
  ckb.experiences.forEach((exp, idx) => {
    const path = `experiences[${idx}] (${exp.id || 'no-id'})`;
    if (!exp.id) logError(`${path} has no id`);
    else {
      validIds.add(exp.id);
      validExperiences.add(exp.id);
    }
    
    // Check mandatory fields
    checkType(exp.organization, 'string', `${path}.organization`);
    checkType(exp.role, 'string', `${path}.role`);
    checkType(exp.start_date, 'string', `${path}.start_date`);
    checkType(exp.end_date, 'string', `${path}.end_date`);
    checkType(exp.summary, 'string', `${path}.summary`);
    checkType(exp.responsibilities, 'array', `${path}.responsibilities`);
    checkType(exp.deliverables, 'array', `${path}.deliverables`);
    checkType(exp.technologies, 'array', `${path}.technologies`);
    checkType(exp.axes, 'array', `${path}.axes`);
    
    // Check optional fields if present
    if (exp.stakeholders) checkType(exp.stakeholders, 'array', `${path}.stakeholders`);
    if (exp.outcomes) checkType(exp.outcomes, 'array', `${path}.outcomes`);
    if (exp.domains) checkType(exp.domains, 'array', `${path}.domains`);
    if (exp.leadership_examples) checkType(exp.leadership_examples, 'array', `${path}.leadership_examples`);
    if (exp.evidence_links) checkType(exp.evidence_links, 'array', `${path}.evidence_links`);
    
    // Validate axes
    if (Array.isArray(exp.axes)) {
      exp.axes.forEach(axis => {
        if (!validAxes.has(axis)) logError(`${path} uses invalid axis: '${axis}'`);
      });
    }
  });

  // 3. Validate Projects
  console.log(`\n${BOLD}[2/5] Validating Projects...${RESET}`);
  if (!checkType(ckb.projects, 'array', 'projects')) return;

  ckb.projects.forEach((proj, idx) => {
    const path = `projects[${idx}] (${proj.id || 'no-id'})`;
    if (!proj.id) logError(`${path} has no id`);
    else {
      validIds.add(proj.id);
      validProjects.add(proj.id);
    }

    checkType(proj.title, 'string', `${path}.title`);
    checkType(proj.organization, 'string', `${path}.organization`);
    checkType(proj.problem, 'string', `${path}.problem`);
    checkType(proj.context, 'string', `${path}.context`);
    checkType(proj.solution, 'string', `${path}.solution`);
    checkType(proj.architecture, 'string', `${path}.architecture`);
    checkType(proj.decisions, 'string', `${path}.decisions`);
    checkType(proj.tradeoffs, 'string', `${path}.tradeoffs`);
    checkType(proj.technologies, 'array', `${path}.technologies`);
    checkType(proj.outcomes, 'array', `${path}.outcomes`);
    checkType(proj.impact, 'array', `${path}.impact`);
    checkType(proj.axes, 'array', `${path}.axes`);
    
    if (proj.reusable_stories) checkType(proj.reusable_stories, 'array', `${path}.reusable_stories`);
    if (proj.interview_questions_supported) checkType(proj.interview_questions_supported, 'array', `${path}.interview_questions_supported`);
    if (proj.evidence) checkType(proj.evidence, 'array', `${path}.evidence`);
    
    // Validate screenshots
    if (proj.screenshots) {
      if (checkType(proj.screenshots, 'array', `${path}.screenshots`)) {
        proj.screenshots.forEach((shot, sIdx) => {
          checkType(shot.url, 'string', `${path}.screenshots[${sIdx}].url`);
          checkType(shot.caption, 'string', `${path}.screenshots[${sIdx}].caption`);
        });
      }
    }
    
    // Validate links
    if (proj.links) {
      if (checkType(proj.links, 'array', `${path}.links`)) {
        proj.links.forEach((lnk, lIdx) => {
          checkType(lnk.name, 'string', `${path}.links[${lIdx}].name`);
          checkType(lnk.url, 'string', `${path}.links[${lIdx}].url`);
        });
      }
    }

    if (Array.isArray(proj.axes)) {
      proj.axes.forEach(axis => {
        if (!validAxes.has(axis)) logError(`${path} uses invalid axis: '${axis}'`);
      });
    }
  });

  // 3. Validate Skills
  console.log(`\n${BOLD}[3/5] Validating Skills...${RESET}`);

  if (ckb.skills) {
    Object.entries(ckb.skills).forEach(([skillName, skillData]) => {
      const skillId = `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`;
      validIds.add(skillId);
      const path = `skills.${skillName}`;
      checkType(skillData.totalYears, 'number', `${path}.totalYears`);
      checkType(skillData.categories, 'object', `${path}.categories`);
      
      if (skillData.categories) {
        Object.entries(skillData.categories).forEach(([catName, catVal]) => {
          const catPath = `${path}.categories.${catName}`;
          checkType(catVal.yearsOfExperience, 'number', `${catPath}.yearsOfExperience`);
          checkType(catVal.confidence, 'string', `${catPath}.confidence`);
          checkType(catVal.description, 'string', `${catPath}.description`);
          
          if (checkType(catVal.projects, 'array', `${catPath}.projects`)) {
            // Referential integrity: verify projects referenced actually exist in validity lists
            catVal.projects.forEach(pId => {
              if (!validIds.has(pId)) {
                logError(`Skill Category '${catPath}' references orphaned Project/Experience ID: '${pId}'`);
              }
            });
          }
        });
      }
    });
  }

  // 5. Validate Talks, Community & Writing
  console.log(`\n${BOLD}[4/5] Validating Talks, Community & Writing...${RESET}`);
  
  // Talks
  if (ckb.talks) {
    if (checkType(ckb.talks, 'array', 'talks')) {
      ckb.talks.forEach((talk, idx) => {
        const path = `talks[${idx}] (${talk.id || 'no-id'})`;
        if (talk.id) validIds.add(talk.id);
        
        checkType(talk.topic, 'string', `${path}.topic`);
        checkType(talk.audience, 'string', `${path}.audience`);
        checkType(talk.duration, 'string', `${path}.duration`);
        checkType(talk.abstract, 'string', `${path}.abstract`);
        checkType(talk.slides, 'string', `${path}.slides`);
        checkType(talk.lessons, 'string', `${path}.lessons`);
        checkType(talk.axes, 'array', `${path}.axes`);
        
        if (checkType(talk.related_projects, 'array', `${path}.related_projects`)) {
          talk.related_projects.forEach(pId => {
            if (!validProjects.has(pId)) {
              logError(`Talk '${path}' references orphaned Project ID: '${pId}'`);
            }
          });
        }
      });
    }
  }

  // Community
  if (ckb.community) {
    if (checkType(ckb.community, 'array', 'community')) {
      ckb.community.forEach((comm, idx) => {
        const path = `community[${idx}] (${comm.id || 'no-id'})`;
        if (comm.id) validIds.add(comm.id);
        
        checkType(comm.name, 'string', `${path}.name`);
        checkType(comm.axes, 'array', `${path}.axes`);
        
        if (comm.volunteering) checkType(comm.volunteering, 'array', `${path}.volunteering`);
        if (comm.theatre) checkType(comm.theatre, 'array', `${path}.theatre`);
        if (comm.facilitation) checkType(comm.facilitation, 'array', `${path}.facilitation`);
        if (comm.workshops) checkType(comm.workshops, 'array', `${path}.workshops`);
        if (comm.organizing) checkType(comm.organizing, 'array', `${path}.organizing`);
      });
    }
  }

  // Writing
  if (ckb.writing) {
    checkType(ckb.writing, 'object', 'writing');
    Object.entries(ckb.writing).forEach(([category, list]) => {
      const path = `writing.${category}`;
      if (checkType(list, 'array', path)) {
        list.forEach((write, idx) => {
          const itemPath = `${path}[${idx}] (${write.id || 'no-id'})`;
          if (write.id) validIds.add(write.id);
          
          checkType(write.title, 'string', `${itemPath}.title`);
          checkType(write.summary, 'string', `${itemPath}.summary`);
          checkType(write.axes, 'array', `${itemPath}.axes`);
        });
      }
    });
  }

  // 6. Test RAG / Scoring Search Simulation
  console.log(`\n${BOLD}[5/5] Running Search Scoring Simulation...${RESET}`);
  // Dynamically import search logic from retrieval layer to ensure it behaves correctly
  try {
    const { searchCKB, generateLocalRAGResponse, generateLocalSTARResponse } = await import('../lib/rag_ckb.mjs');
    
    // Simulate query 1: Technical Leadership
    const matches1 = await searchCKB('technical leadership');
    if (matches1.length === 0) {
      logError("Search simulation for 'technical leadership' returned 0 matches.");
    } else {
      const topMatch = matches1[0];
      if (topMatch.id !== 'proj-axelrod' && topMatch.id !== 'exp-mentat-commons' && topMatch.id !== 'proj-smart-waste') {
        logWarning(`Search simulation for 'technical leadership' returned unexpected top match: '${topMatch.id}' (Score: ${topMatch.score})`);
      } else {
        logSuccess(`Search simulation for 'technical leadership' ranked correctly. Top: '${topMatch.id}' (Score: ${topMatch.score})`);
      }
    }

    // Simulate query 2: Mentoring
    const matches2 = await searchCKB('mentoring junior');
    if (matches2.length === 0) {
      logError("Search simulation for 'mentoring junior' returned 0 matches.");
    } else {
      const hasCoachingMatch = matches2.some(m => m.id === 'proj-decision-labs' || m.id === 'exp-bene-data' || m.id === 'exp-mentat-commons');
      if (hasCoachingMatch) {
        logSuccess("Search simulation for 'mentoring junior' correctly boosted coaching/teaching nodes.");
      } else {
        logWarning("Search simulation for 'mentoring junior' did not prioritize mentoring nodes.");
      }
    }

    // Simulate local RAG output check (Provenance trace validation)
    const matches3 = await searchCKB('systems thinking');
    const localRAGText = generateLocalRAGResponse('systems thinking', matches3);
    
    const traceRegex = /\[([a-zA-Z0-9-&]+)\]\(file:\/\/\//g;
    let foundTrace = false;
    let traceMatch;
    while ((traceMatch = traceRegex.exec(localRAGText)) !== null) {
      const traceId = traceMatch[1];
      if (validIds.has(traceId)) {
        foundTrace = true;
      } else {
        logError(`RAG generated text references invalid trace ID: '${traceId}'`);
      }
    }
    if (foundTrace) {
      logSuccess("Provenance trace validation succeeded: generated text contains valid references back to CKB sources.");
    } else {
      logError("Provenance trace validation failed: local response text lacks valid trace ID format.");
    }

    // Simulate local STAR output check
    const matches4 = await searchCKB('difficult stakeholder');
    const starResponse = generateLocalSTARResponse('difficult stakeholder', matches4);
    if (starResponse.situation && starResponse.task && starResponse.action && starResponse.result) {
      logSuccess("Interview STAR generation validation succeeded: returned all 4 structured categories.");
    } else {
      logError("Interview STAR generation validation failed: structure is missing keys.");
    }

  } catch (err) {
    logError(`Failed to load or execute search retrieval simulation: ${err.message}`);
  }

  // Summary Report
  console.log(`\n${BOLD}========================================${RESET}`);
  if (failed) {
    console.log(`${RED}${BOLD}Validation FAILED. Please correct errors listed above.${RESET}`);
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}Validation PASSED. Career Knowledge Base is completely healthy!${RESET}`);
    process.exit(0);
  }
}

validate();
