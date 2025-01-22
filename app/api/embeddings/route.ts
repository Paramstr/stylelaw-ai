import { NextRequest } from 'next/server'
import { getEmbeddings, getBM25Tokens } from '@/lib/research/vectorizer'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  console.log('API Route - Environment check:', {
    hasVoyageKey: !!process.env.VOYAGE_API_KEY,
    keyPrefix: process.env.VOYAGE_API_KEY?.substring(0, 5)
  });

  try {
    const { text } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return Response.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    console.log('API Route - Processing text:', { length: text.length });
    const [denseVector] = await getEmbeddings(text)
    const sparseVector = await getBM25Tokens(text)
    
    return Response.json({ denseVector, sparseVector })
  } catch (error) {
    console.error('API Route - Error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate embeddings' },
      { status: 500 }
    )
  }
} 