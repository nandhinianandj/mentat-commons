import fs from 'fs/promises';
import path from 'path';

const EMBEDDINGS_FILE = path.join(process.cwd(), 'data', 'embeddings.json');

let embeddingsCache = null;
const queryCache = new Map();

/**
 * Calculates Euclidean L2 norm of a vector.
 * @param {number[]} vec
 * @returns {number}
 */
export function calculateNorm(vec) {
  if (!vec || !vec.length) return 0;
  let normSq = 0;
  for (let i = 0; i < vec.length; i++) {
    normSq += vec[i] * vec[i];
  }
  return Math.sqrt(normSq);
}

/**
 * Optimized cosine similarity calculation.
 * Accepts pre-calculated norms to avoid redundant sqrt and dot norm operations
 * in nested inner loops across document matrices.
 *
 * @param {number[]} vecA - Query vector
 * @param {number[]} vecB - Document vector
 * @param {number} [normA] - Pre-calculated norm of vecA
 * @param {number} [normB] - Pre-calculated norm of vecB
 * @returns {number} Cosine similarity score between -1 and 1
 */
export function cosineSimilarity(vecA, vecB, normA, normB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  const nA = normA !== undefined ? normA : calculateNorm(vecA);
  const nB = normB !== undefined ? normB : calculateNorm(vecB);

  if (nA === 0 || nB === 0) return 0;

  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }

  return dotProduct / (nA * nB);
}

/**
 * Loads vector embeddings from disk, caching the parsed documents
 * and ensuring all document vector norms are strictly pre-computed.
 *
 * @returns {Promise<Array<{ source: string, content: string, embedding: number[], norm: number }>>}
 */
export async function getEmbeddings() {
  if (embeddingsCache) {
    return embeddingsCache;
  }

  try {
    const data = await fs.readFile(EMBEDDINGS_FILE, 'utf-8');
    const documents = JSON.parse(data);

    // Pre-calculate and cache L2 norms on all documents so inner loops run at O(N) instead of O(3N)
    for (let i = 0; i < documents.length; i++) {
      if (documents[i].norm === undefined && documents[i].embedding) {
        documents[i].norm = calculateNorm(documents[i].embedding);
      }
    }

    embeddingsCache = documents;
    return embeddingsCache;
  } catch (error) {
    console.error('Error loading embeddings:', error);
    return [];
  }
}

/**
 * Generates an embedding for input text using native fetch, caching identical queries in-memory
 * to prevent duplicate API roundtrips and avoid matrix recomputations.
 *
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text) {
  const normalizedText = text.replace(/\n/g, ' ').trim();

  if (queryCache.has(normalizedText)) {
    return queryCache.get(normalizedText);
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey !== 'mock-key') {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: normalizedText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const embedding = data.data[0].embedding;
        queryCache.set(normalizedText, embedding);
        return embedding;
      }
    } catch (error) {
      console.error('Error fetching live embedding:', error);
    }
  }

  // Deterministic mock embedding (1536-dimensional) when no key is set or on fallback
  let hash = 0;
  for (let i = 0; i < normalizedText.length; i++) {
    hash = ((hash << 5) - hash) + normalizedText.charCodeAt(i);
    hash |= 0;
  }
  const mockEmbedding = Array(1536).fill(0).map((_, i) => {
    const x = Math.sin(hash + i);
    return (x - Math.floor(x));
  });
  queryCache.set(normalizedText, mockEmbedding);
  return mockEmbedding;
}

/**
 * Searches documents for content relevant to the query embedding.
 * Calculates query vector norm once outside the loop, avoiding redundant norm calculations
 * inside internal nested comparative arrays.
 *
 * @param {number[]} queryEmbedding - Query vector
 * @param {number} [topK=5] - Number of top results to return
 * @returns {Promise<Array>} Ranked documents with similarity scores
 */
export async function findRelevantContent(queryEmbedding, topK = 5) {
  const documents = await getEmbeddings();
  const queryNorm = calculateNorm(queryEmbedding);

  if (queryNorm === 0 || !documents.length) {
    return [];
  }

  // Pre-computed queryNorm and doc.norm ensures single dot-product pass per candidate
  const scoredDocs = documents.map(doc => {
    const docNorm = doc.norm !== undefined ? doc.norm : calculateNorm(doc.embedding);
    return {
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding, queryNorm, docNorm),
    };
  });

  scoredDocs.sort((a, b) => b.similarity - a.similarity);

  return scoredDocs.slice(0, topK);
}
