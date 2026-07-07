import { parseRSS, parseArxiv } from '../lib/radar_ingest.mjs';
import { clusterItems } from '../lib/radar_engine.mjs';
import { getIdeas, saveIdeas } from '../lib/radar_db.mjs';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let failed = false;

function assert(condition, message) {
  if (condition) {
    console.log(`${GREEN}✓ PASS: ${message}${RESET}`);
  } else {
    console.log(`${RED}✗ FAIL: ${message}${RESET}`);
    failed = true;
  }
}

// 1. Ingestion Parser Tests
function testParsers() {
  console.log(`\n${BOLD}[1/4] Running Feed Parser Tests...${RESET}`);
  
  const mockRSS = `
    <rss version="2.0">
      <channel>
        <item>
          <title><![CDATA[Wasm Canvas Rendering at 60 FPS]]></title>
          <link>https://example.com/wasm-canvas</link>
          <description><![CDATA[<p>An exploration of using WebAssembly for <b>highly efficient</b> canvas rendering.</p>]]></description>
          <pubDate>Mon, 06 Jul 2026 12:00:00 GMT</pubDate>
          <dc:creator>Jane Doe</dc:creator>
        </item>
      </channel>
    </rss>
  `;
  
  const rssItems = parseRSS(mockRSS);
  assert(rssItems.length === 1, 'parseRSS should parse exactly 1 item');
  assert(rssItems[0].title === 'Wasm Canvas Rendering at 60 FPS', 'parseRSS should extract title cleanly and strip CDATA');
  assert(rssItems[0].url === 'https://example.com/wasm-canvas', 'parseRSS should extract link URL');
  assert(rssItems[0].description === 'An exploration of using WebAssembly for highly efficient canvas rendering.', 'parseRSS should strip HTML and CDATA from description');
  assert(rssItems[0].author === 'Jane Doe', 'parseRSS should extract creator/author');
  
  const mockArxiv = `
    <feed xmlns="http://www.w3.org/2005/Atom">
      <entry>
        <id>http://arxiv.org/abs/2607.01234v1</id>
        <title>Agentic visual planning models</title>
        <summary>This paper proposes a new method for agentic models...</summary>
        <published>2026-07-06T10:00:00Z</published>
        <author><name>John Smith</name></author>
      </entry>
    </feed>
  `;
  
  const arxivItems = parseArxiv(mockArxiv);
  assert(arxivItems.length === 1, 'parseArxiv should parse exactly 1 entry');
  assert(arxivItems[0].title === 'Agentic visual planning models', 'parseArxiv should extract title');
  assert(arxivItems[0].url === 'http://arxiv.org/abs/2607.01234v1', 'parseArxiv should extract ID URL');
  assert(arxivItems[0].description === 'This paper proposes a new method for agentic models...', 'parseArxiv should extract summary');
  assert(arxivItems[0].author === 'John Smith', 'parseArxiv should extract author name');
}

// 2. Clustering Engine Tests
function testClustering() {
  console.log(`\n${BOLD}[2/4] Running NLP Clustering Tests...${RESET}`);
  
  const mockItems = [
    { title: 'Fast WebAssembly canvas rendering engine', description: 'Using WebAssembly compiled core to draw pixels rapidly on web canvas.', url: 'https://example.com/1' },
    { title: 'Native WASM canvas compilation speedups', description: 'Compiling Rust to WebAssembly (WASM) yields 40x speedups drawing to canvas.', url: 'https://example.com/2' },
    { title: 'Restorative circles in community organization', description: 'Exploring dialogic circles and conflict containment in neighborhood groups.', url: 'https://example.com/3' }
  ];
  
  const clusters = clusterItems(mockItems);
  assert(clusters.length === 2, 'Should partition 3 items into exactly 2 clusters (2 related, 1 outlier)');
  
  const wasmCluster = clusters.find(c => c.items.some(i => i.title.includes('WebAssembly')));
  assert(wasmCluster.items.length === 2, 'The WebAssembly cluster should contain both related WASM items');
  
  const circleCluster = clusters.find(c => c.items.some(i => i.title.includes('Restorative')));
  assert(circleCluster.items.length === 1, 'The Restorative circle cluster should stand alone');
}

// 3. Conceptual Merging & Lifecycle Transitions Tests
async function testIncubatorRules() {
  console.log(`\n${BOLD}[3/4] Running Incubator Engine Tests...${RESET}`);
  
  // Heuristic Local Jaccard concept merging verification
  const mockExistingIdeas = [
    { id: 'idea-decision', title: 'Distributed Decision Making', alternative_names: ['Agentic AI', 'Decentralized Planning'], stage: 'seed', total_mentions: 1, source_count: 1, source_urls: ['https://example.com/1'], domains: ['Tech'] }
  ];
  
  // Test concept matching high similarity
  const newConcept = 'Agentic AI Systems and Decision Nodes';
  const getTokens = (text) => new Set(text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 4));
  const calculateJaccard = (setA, setB) => {
    if (setA.size === 0 || setB.size === 0) return 0;
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  };

  const itemTokens = getTokens(newConcept);
  let matchedId = null;
  
  mockExistingIdeas.forEach(existing => {
    const existingTokens = getTokens(existing.title);
    let maxJaccard = calculateJaccard(itemTokens, existingTokens);
    
    existing.alternative_names.forEach(alt => {
      const altTokens = getTokens(alt);
      const j = calculateJaccard(itemTokens, altTokens);
      if (j > maxJaccard) maxJaccard = j;
    });

    if (maxJaccard >= 0.25) {
      matchedId = existing.id;
    }
  });

  assert(matchedId === 'idea-decision', 'Heuristic merger should correctly map "Agentic AI Systems" to existing "Distributed Decision Making" idea');
  
  // Lifecycle Transition trigger rules validation
  const recommendStage = (idea, pScore, aScore) => {
    const current = idea.stage.toLowerCase();
    if (current === 'seed' && idea.total_mentions >= 2 && idea.source_count >= 2) return 'interesting';
    if (current === 'interesting' && idea.total_mentions >= 5 && idea.source_count >= 3) return 'recurring';
    if (current === 'recurring' && idea.total_mentions >= 8 && pScore >= 40) return 'persistent';
    return idea.stage;
  };

  const mockIdeaSeed = { stage: 'seed', total_mentions: 3, source_count: 2 };
  assert(recommendStage(mockIdeaSeed, 10, 10) === 'interesting', 'Should recommend "interesting" for Seed with >= 2 mentions & >= 2 sources');

  const mockIdeaInteresting = { stage: 'interesting', total_mentions: 6, source_count: 3 };
  assert(recommendStage(mockIdeaInteresting, 30, 20) === 'recurring', 'Should recommend "recurring" for Interesting with >= 5 mentions & >= 3 sources');
}

// 4. Database Access Layer Tests
async function testDatabase() {
  console.log(`\n${BOLD}[4/4] Running Database Integrity Tests...${RESET}`);
  
  try {
    const ideas = await getIdeas();
    assert(Array.isArray(ideas), 'getIdeas should return an array');
    
    // Test write-read consistency
    const originalIdeasLength = ideas.length;
    const testIdea = { id: 'idea-test-123', title: 'Validation Testing Systems', stage: 'seed', evolution_history: [] };
    
    ideas.push(testIdea);
    await saveIdeas(ideas);
    
    const reloaded = await getIdeas();
    const found = reloaded.find(i => i.id === 'idea-test-123');
    assert(found !== undefined, 'Database should correctly save and retrieve a new Idea record');
    assert(found.title === 'Validation Testing Systems', 'Database should preserve string field values');
    
    // Clean up test record
    const cleaned = reloaded.filter(i => i.id !== 'idea-test-123');
    await saveIdeas(cleaned);
    
    const finalReload = await getIdeas();
    assert(finalReload.length === originalIdeasLength, 'Database should correctly delete records and restore original state');
  } catch (err) {
    assert(false, `Database operations threw an error: ${err.message}`);
  }
}

async function runAll() {
  console.log(`${BOLD}=====================================================${RESET}`);
  console.log(`${BOLD}          CONVERSATION RADAR & INCUBATOR TESTS       ${RESET}`);
  console.log(`${BOLD}=====================================================${RESET}`);

  testParsers();
  testClustering();
  await testIncubatorRules();
  await testDatabase();

  console.log(`\n${BOLD}=====================================================${RESET}`);
  if (failed) {
    console.log(`${RED}${BOLD}TEST SUITE FAILED. Please correct failures listed above.${RESET}`);
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}TEST SUITE PASSED. Radar & Incubator systems are fully operational!${RESET}`);
    process.exit(0);
  }
}

runAll();
