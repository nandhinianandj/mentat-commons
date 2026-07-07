import { getIdeas, getQuestionDrifts } from '../../../../lib/radar_db.mjs';
import { compileWeeklyReview } from '../../../../lib/incubator_engine.mjs';

export async function GET() {
  try {
    const ideas = await getIdeas();
    const drifts = await getQuestionDrifts();
    
    return new Response(JSON.stringify({ ideas, drifts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    });
  } catch (error) {
    console.error("Error loading incubator data in GET route:", error);
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
    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || (process.env.OLLAMA_MODEL ? 'ollama' : null) || (process.env.CLOUDFLARE_API_TOKEN ? 'cloudflare' : null);
    
    console.log("[Incubator API] Running weekly review compile...");
    const review = await compileWeeklyReview(effectiveApiKey);
    
    return new Response(JSON.stringify({ success: true, review }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error compiling weekly review in POST route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
