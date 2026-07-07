import { getBriefings, getMemory } from '../../../../lib/radar_db.mjs';
import { ingestAll } from '../../../../lib/radar_ingest.mjs';
import { processRadarBriefing } from '../../../../lib/radar_engine.mjs';

export async function GET() {
  try {
    const briefings = await getBriefings();
    const memory = await getMemory();
    return new Response(JSON.stringify({ briefings, memory }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    });
  } catch (error) {
    console.error("Error loading briefings in GET route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {}
    
    const { apiKey } = body;
    
    // Resolve key from parameters or server env config
    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || (process.env.OLLAMA_MODEL ? 'ollama' : null) || (process.env.CLOUDFLARE_API_TOKEN ? 'cloudflare' : null);
    
    console.log("[Radar API] Running ingestion...");
    await ingestAll();
    
    console.log("[Radar API] Running processing pipeline...");
    const briefing = await processRadarBriefing(effectiveApiKey);
    
    return new Response(JSON.stringify({ success: true, briefing }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error processing daily radar briefing in POST route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
