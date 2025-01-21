import { Vectorizer } from '../lib/research/vectorizer'

describe('Vectorizer', () => {
  let vectorizer: Vectorizer

  beforeEach(() => {
    vectorizer = new Vectorizer()
  })

  test('environment variables are properly loaded', () => {
    expect(process.env.VOYAGE_API_KEY).toBeDefined()
    expect(process.env.VOYAGE_API_KEY).not.toBe('')
    console.log('API Key loaded:', !!process.env.VOYAGE_API_KEY)
  })

  test('should generate correct BM25 tokens', () => {
    const text = "Hello world! This is a test."
    const result = vectorizer.getBM25Tokens(text)
    
    expect(result).toHaveProperty('indices')
    expect(result).toHaveProperty('values')
    expect(result.indices).toBeInstanceOf(Array)
    expect(result.values).toBeInstanceOf(Array)
    expect(result.indices.length).toBe(result.values.length)
  })

  test('should generate embeddings with correct dimensions', async () => {
    const text = "Test sentence for embedding generation."
    const embeddings = await vectorizer.getEmbeddings(text)
    
    expect(embeddings).toBeInstanceOf(Array)
    expect(embeddings[0]).toBeInstanceOf(Array)
    // Voyage embeddings should have specific dimensions
    expect(embeddings[0].length).toBe(1024) // Verify the expected dimension
  })
})