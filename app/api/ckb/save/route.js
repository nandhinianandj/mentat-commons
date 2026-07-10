import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { ckbData } = body;
    if (!ckbData || typeof ckbData !== 'object') {
      return new Response(JSON.stringify({ error: "Missing 'ckbData' object" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic structure validation
    if (!Array.isArray(ckbData.experiences) || !Array.isArray(ckbData.projects)) {
      return new Response(JSON.stringify({ error: "Invalid CKB format: 'experiences' and 'projects' must be arrays" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dbPath = path.resolve('data/career_knowledge_base.json');
    console.log(`[CKB API] Saving updated career knowledge base to: ${dbPath}...`);
    
    // Save to local file
    await fs.writeFile(dbPath, JSON.stringify(ckbData, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, message: "Career Knowledge Base updated successfully" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error saving career knowledge base:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
