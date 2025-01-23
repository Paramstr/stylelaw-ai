import { Index } from '@upstash/vector'

export async function searchDocuments(queryText: string, topK: number = 5) {
  console.log('Starting search with:', { queryText, topK });

  // First, get embeddings from our server-side API
  console.log('Fetching embeddings...');
  const embeddingsResponse = await fetch('/api/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: queryText }),
  });

  if (!embeddingsResponse.ok) {
    const error = await embeddingsResponse.json();
    console.error('Embeddings API error:', error);
    throw new Error(error.error || 'Failed to generate embeddings');
  }

  const { denseVector, sparseVector } = await embeddingsResponse.json();
  console.log('Received embeddings:', { 
    denseVectorLength: denseVector?.length,
    hasSparseVector: !!sparseVector,
    sparseIndices: sparseVector?.indices?.length,
    sparseValues: sparseVector?.values?.length
  });

  // Use server-side search endpoint
  console.log('Calling search API...');
  const searchResponse = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vector: denseVector,
      sparseVector,
      topK
    }),
  });

  if (!searchResponse.ok) {
    const error = await searchResponse.json();
    console.error('Search API error:', error);
    throw new Error(error.error || 'Search failed');
  }

  const results = await searchResponse.json();
  console.log('Search results:', {
    count: results?.length || 0,
    firstResult: results?.[0] ? {
      score: results[0].score,
      filename: results[0].metadata?.filename,
      contentLength: results[0].metadata?.content?.toString().length || 0
    } : null
  });

  return results;
} 