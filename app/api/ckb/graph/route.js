import { loadGraph } from '../../../../lib/rag_ckb.mjs';

export async function GET() {
  try {
    const data = await loadGraph();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    });
  } catch (error) {
    console.error("Error loading CKB graph in GET route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
