import { DocumentUpserter } from '../lib/research/upserter'
import path from 'path'
import fs from 'fs/promises'

describe('Document Processing Pipeline', () => {
  let upserter: DocumentUpserter
  const TEST_OUTPUT_DIR = path.join(__dirname, 'output')
  
  beforeEach(async () => {
    upserter = new DocumentUpserter()
    // Ensure output directory exists
    await fs.mkdir(TEST_OUTPUT_DIR, { recursive: true })
  })

  test.skip('should process folder and generate correct chunks', async () => {
    /**
     * Required test setup:
     * - A 'test-pdfs' folder must exist in the same directory as this test file
     * - The folder should contain at least one PDF file for processing
     * - Path: {project_root}/app/tests/test-pdfs/
     */
    const testDir = path.join(__dirname, 'test-pdfs')
    const processedChunks = await upserter.processFolder(testDir)
    
    expect(processedChunks).toBeInstanceOf(Array)
    expect(processedChunks.length).toBeGreaterThan(0)
    
    // Verify chunk structure
    const firstChunk = processedChunks[0]
    expect(firstChunk).toHaveProperty('content')
    expect(firstChunk).toHaveProperty('metadata')
    expect(firstChunk.metadata).toHaveProperty('filename')
    expect(firstChunk.metadata).toHaveProperty('chunkIndex')
  })

  test.skip('should correctly upsert chunks to vector store', async () => {
    const testChunks = [{
      content: "Test content",
      metadata: {
        filename: "test.pdf",
        chunkIndex: 0
      }
    }]

    await expect(upserter.upsertChunks(testChunks)).resolves.not.toThrow()
  })

  describe('Query Tests', () => {
    beforeAll(async () => {
      // Initialize upserter first
      upserter = new DocumentUpserter()
      
      // Then load and upsert test documents
      const testDir = path.join(__dirname, 'test-pdfs')
      const chunks = await upserter.processFolder(testDir)
      await upserter.upsertChunks(chunks)
    })

    test('should perform semantic search for family law concepts', async () => {
      const queries = [
        "What are the grounds for divorce?",
        "How is child custody determined?",
        "What factors affect alimony payments?"
      ]

      const results = await Promise.all(queries.map(async query => {
        const queryResults = await upserter.query(query, 3)
        return { query, results: queryResults }
      }))

      // Save results to file for manual inspection
      const outputPath = path.join(TEST_OUTPUT_DIR, 'semantic-search-results.json')
      await fs.writeFile(
        outputPath, 
        JSON.stringify(results, null, 2),
        'utf-8'
      )

      // Verify result structure
      results.forEach(result => {
        expect(Array.isArray(result.results)).toBe(true)
        expect(result.results.length).toBeLessThanOrEqual(3)
        result.results.forEach(item => {
          expect(item).toHaveProperty('score')
          expect(item).toHaveProperty('metadata')
          expect(item.metadata).toHaveProperty('content')
        })
      })
    })

    test('should perform hybrid search combining semantic and keyword matching', async () => {
      const query = "child custody rights"
      const results = await upserter.query(query, 5)

      const outputPath = path.join(TEST_OUTPUT_DIR, 'hybrid-search-comparison.json')
      await fs.writeFile(
        outputPath,
        JSON.stringify({
          query,
          results
        }, null, 2),
        'utf-8'
      )

      expect(results).toHaveLength(5)
    })

    test('should filter results by metadata', async () => {
      const query = "custody agreement"
      const results = await upserter.query(query, 5)

      const outputPath = path.join(TEST_OUTPUT_DIR, 'filtered-results.json')
      await fs.writeFile(
        outputPath,
        JSON.stringify(results, null, 2),
        'utf-8'
      )

      results.forEach(result => {
        expect(result.metadata?.filename).toBeDefined()
      })
    })

    test('should find relevant case law by content and case number', async () => {
      const caseNumber = "2024_NZFC2353"
      const results = await upserter.query(
        `What did the court decide in ${caseNumber} regarding custody?`,
        3
      )

      const outputPath = path.join(TEST_OUTPUT_DIR, 'case-specific-results.json')
      await fs.writeFile(
        outputPath,
        JSON.stringify(results, null, 2),
        'utf-8'
      )

      expect(results).toBeDefined()
      expect(results.length).toBeGreaterThan(0)
    })
  })
})