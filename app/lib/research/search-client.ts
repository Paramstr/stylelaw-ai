'use server'

import { Index } from '@upstash/vector'
import type { SearchResult } from './types'
import { getEmbeddings, getBM25Tokens } from '@/lib/research/vectorizer'

export async function searchDocuments(queryText: string, topK: number = 5): Promise<SearchResult[]> {
  try {
    // Get embeddings directly using the vectorizer
    const [denseVector] = await getEmbeddings(queryText);
    const sparseVector = await getBM25Tokens(queryText);
    
    // Initialize Upstash client
    const index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!
    });

    // Query the index directly
    const namespace = index.namespace("family_court")
    const results = await namespace.query({
      vector: denseVector,
      sparseVector,
      topK,
      includeMetadata: true
    });
    
    // Transform results to match SearchResult type
    return results.map((result: any) => ({
      id: result.id,
      score: result.score,
      metadata: result.metadata.caseData,
      chunk: {
        content: result.metadata.content,
        filename: result.metadata.filename,
        chunkIndex: result.metadata.chunkIndex
      }
    }));
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
} 