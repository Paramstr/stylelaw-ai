import { NextRequest } from 'next/server'
import { Index } from '@upstash/vector'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { vector, sparseVector, topK } = await request.json()
    
    if (!vector) {
      return Response.json(
        { error: 'Vector is required' },
        { status: 400 }
      )
    }

    const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
    const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

    console.log('Search API - Checking Upstash config:', {
      hasUrl: !!upstashUrl,
      hasToken: !!upstashToken,
      urlPrefix: upstashUrl?.substring(0, 20)
    });

    if (!upstashUrl || !upstashToken) {
      throw new Error('Missing Upstash configuration');
    }

    console.log('Search API - Initializing Upstash...');
    const index = new Index({
      url: upstashUrl,
      token: upstashToken
    });

    console.log('Search API - Querying Upstash...');
    const namespace = index.namespace("family_court")

    const results = await namespace.query({
      vector,
      sparseVector,
      topK: topK || 5,
      includeMetadata: true
    });

    console.log('Search API - Results:', {
      count: results?.length || 0,
      hasResults: !!results?.length
    });

    return Response.json(results)
  } catch (error) {
    console.error('Search API - Error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    )
  }
} 