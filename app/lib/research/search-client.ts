import { Index } from '@upstash/vector'

export async function searchDocuments(queryText: string, topK: number = 5) {
  // First, get embeddings from our server-side API
  const embeddingsResponse = await fetch('/api/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: queryText }),
  });

  if (!embeddingsResponse.ok) {
    const error = await embeddingsResponse.json();
    throw new Error(error.error || 'Failed to generate embeddings');
  }

  const { denseVector, sparseVector } = await embeddingsResponse.json();

  // Then use Upstash for search
  const index = new Index({
    url: "https://next-mudfish-97661-us1-vector.upstash.io",
    token: "ABYIMG5leHQtbXVkZmlzaC05NzY2MS11czFyZWFkb25seU16TTBNRFU1WXpndE1qZ3pNQzAwTVdFNUxUbGpZV010TjJNeE9USmhZamRpTVRBNQ=="
  });
  
  const results = await index.query({
    vector: denseVector,
    sparseVector,
    topK,
    includeMetadata: true
  });

  return results;
} 