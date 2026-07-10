import { compileArtifact } from '../../../../lib/evidence_engine.mjs';

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {}
    
    const { type, targetText, apiKey, options } = body;
    
    if (!type || !targetText) {
      return new Response(JSON.stringify({ error: "Missing required fields: 'type' and 'targetText'" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Resolve API key from payload parameters or server environment variables
    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || (process.env.OLLAMA_MODEL ? 'ollama' : null) || (process.env.CLOUDFLARE_API_TOKEN ? 'cloudflare' : null);
    
    console.log(`[Evidence API] Compiling artifact type: '${type}'...`);
    const result = await compileArtifact(type, targetText, effectiveApiKey, options || {});
    
    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error generating professional artifact in POST route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
