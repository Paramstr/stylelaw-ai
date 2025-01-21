import { chunkPDFDocument } from '../lib/research/chunker'
import fs from 'fs/promises'
import path from 'path'

describe('PDF Chunker', () => {
  test('should correctly chunk text and save to file', async () => {
    // Use existing test PDF
    const testFilePath = path.join(__dirname, 'test.pdf')
    const chunks = await chunkPDFDocument(testFilePath, "test.pdf")
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'output')
    await fs.mkdir(outputDir, { recursive: true })
    
    // Save chunks to file with detailed formatting
    const outputFile = path.join(outputDir, 'chunks-output.txt')
    const chunkOutput = chunks.map((chunk, index) => {
      return `\n=== Chunk ${index} ===\n` +
             `Size: ${chunk.content.length} characters\n` +
             `Filename: ${chunk.metadata.filename}\n` +
             `ChunkIndex: ${chunk.metadata.chunkIndex}\n` +
             `Content:\n${chunk.content}\n` +
             `${'='.repeat(50)}\n`
    }).join('\n')
    
    await fs.writeFile(outputFile, chunkOutput, 'utf-8')
    
    // Run assertions
    chunks.forEach(chunk => {
      expect(chunk.content.length).toBeLessThanOrEqual(8800)
      console.log(`Chunk ${chunk.metadata.chunkIndex} size: ${chunk.content.length}`)
    })

    // Log the total number of chunks
    console.log(`Total chunks created: ${chunks.length}`)
    
    // Verify file was created
    const fileExists = await fs.access(outputFile)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)
  })

  test('should correctly chunk text based on size limit', async () => {
    // Create a test PDF file with known content
    const testFilePath = path.join(__dirname, 'test.pdf')
    const testFileName = 'test.pdf'
    
    // Test with a large paragraph that should be split
    const chunks = await chunkPDFDocument(testFilePath, testFileName)
    
    expect(chunks).toBeInstanceOf(Array)
    expect(chunks[0].metadata.chunkIndex).toBe(0)
    expect(chunks[0].metadata.filename).toBe(testFileName)
    expect(chunks[0].content.length).toBeLessThanOrEqual(8800)
  })

  test('should preserve sentence boundaries', async () => {
    const testFilePath = path.join(__dirname, 'test.pdf')
    const chunks = await chunkPDFDocument(testFilePath, 'test.pdf')
    
    // Check that chunks end with sentence terminators
    chunks.forEach(chunk => {
      expect(chunk.content.trim()).toMatch(/[.!?]$/)
    })
  })
}) 