import fs from 'fs/promises';
import path from 'path';

const RADAR_DB_FILE = path.join(process.cwd(), 'data', 'radar_db.json');

// Default Seed Feed Sources
const DEFAULT_SOURCES = [
  { id: 'src-hn', name: 'Hacker News Frontpage', url: 'https://hnrss.org/frontpage', sourceType: 'rss', active: 1 },
  { id: 'src-arxiv-ai', name: 'arXiv Artificial Intelligence', url: 'http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending', sourceType: 'arxiv', active: 1 },
  { id: 'src-anthropic', name: 'Anthropic News', url: 'https://www.anthropic.com/news', sourceType: 'rss', active: 1 },
  { id: 'src-openai', name: 'OpenAI Blog Feed', url: 'https://openai.com/blog/rss.xml', sourceType: 'rss', active: 1 },
  { id: 'src-google-ai', name: 'Google Research Blog', url: 'https://feeds.feedburner.com/blogspot/gmtc', sourceType: 'rss', active: 1 }
];

const DEFAULT_DRIFTS = [
  { shallowTerm: 'Prompt Engineering', deepQuestionTerm: 'Human-Computer Collaboration' },
  { shallowTerm: 'MCP', deepQuestionTerm: 'Coordination' },
  { shallowTerm: 'Model Hallucination', deepQuestionTerm: 'Evidence' },
  { shallowTerm: 'Agentic AI', deepQuestionTerm: 'Distributed Decision Making' },
  { shallowTerm: 'AI Safety', deepQuestionTerm: 'Governance' },
  { shallowTerm: 'Vector Databases', deepQuestionTerm: 'Knowledge Representation' }
];

async function ensureDb() {
  try {
    await fs.access(RADAR_DB_FILE);
  } catch {
    // If db file doesn't exist, create it with seed schemas
    const initialSchema = {
      sources: DEFAULT_SOURCES,
      items: [],
      briefings: [],
      memory: [],
      ideas: [],
      questionDrifts: DEFAULT_DRIFTS
    };
    await fs.mkdir(path.dirname(RADAR_DB_FILE), { recursive: true });
    await fs.writeFile(RADAR_DB_FILE, JSON.stringify(initialSchema, null, 2), 'utf-8');
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(RADAR_DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await ensureDb();
  await fs.writeFile(RADAR_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Sources Interface
export async function getSources() {
  const db = await readDb();
  return db.sources || [];
}

export async function saveSources(sources) {
  const db = await readDb();
  db.sources = sources;
  await writeDb(db);
}

// Items Interface (Cache management)
export async function getItems() {
  const db = await readDb();
  return db.items || [];
}

export async function saveItems(newItems) {
  const db = await readDb();
  const existingItems = db.items || [];
  
  // Merge items based on URL to prevent duplicates
  const mergedMap = new Map();
  existingItems.forEach(item => mergedMap.set(item.url, item));
  newItems.forEach(item => mergedMap.set(item.url, item));
  
  // Cap at 1000 items to prevent cache bloating
  const mergedList = Array.from(mergedMap.values())
    .sort((a, b) => new Date(b.publishedAt || b.ingestedAt) - new Date(a.publishedAt || a.ingestedAt))
    .slice(0, 1000);

  db.items = mergedList;
  await writeDb(db);
}

// Briefings Interface
export async function getBriefings() {
  const db = await readDb();
  return db.briefings || [];
}

export async function saveBriefing(briefing) {
  const db = await readDb();
  const existing = db.briefings || [];
  
  // Remove existing briefing for the same date if it exists
  const filtered = existing.filter(b => b.date !== briefing.date);
  filtered.push(briefing);
  
  // Sort descending by date
  db.briefings = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  await writeDb(db);
}

// Memory Interface
export async function getMemory() {
  const db = await readDb();
  return db.memory || [];
}

export async function saveMemory(memoryList) {
  const db = await readDb();
  db.memory = memoryList;
  await writeDb(db);
}

// Ideas Interface
export async function getIdeas() {
  const db = await readDb();
  return db.ideas || [];
}

export async function saveIdeas(ideas) {
  const db = await readDb();
  db.ideas = ideas;
  await writeDb(db);
}

// Question Drifts Interface
export async function getQuestionDrifts() {
  const db = await readDb();
  return db.questionDrifts || [];
}

export async function saveQuestionDrifts(drifts) {
  const db = await readDb();
  db.questionDrifts = drifts;
  await writeDb(db);
}
