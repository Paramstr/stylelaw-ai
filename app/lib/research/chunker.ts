import { extractTextFromPDF } from './pdf-parser'
import fs from 'fs/promises'

interface TextChunk {
  content: string;
  metadata: {
    filename: string;
    chunkIndex: number;
  };
}

export async function chunkPDFDocument(filePath: string, filename: string): Promise<TextChunk[]> {
  const MAX_CHUNK_SIZE = 8800;
  const chunks: TextChunk[] = [];
  
  // Read file as buffer
  const fileBuffer = await fs.readFile(filePath);
  let text = await extractTextFromPDF(fileBuffer);
  
  // Clean up the text
  text = text
    .replace(/\s+/g, ' ')           // Replace multiple whitespaces with single space
    .replace(/\n+/g, '\n')          // Replace multiple newlines with single newline
    .replace(/\s+\n/g, '\n')        // Remove spaces before newlines
    .replace(/\n\s+/g, '\n')        // Remove spaces after newlines
    .trim();                        // Remove leading/trailing whitespace
  
  // Improved sentence splitting with regex
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    const potentialChunk = currentChunk ? `${currentChunk} ${trimmedSentence}` : trimmedSentence;
    
    if (potentialChunk.length > MAX_CHUNK_SIZE) {
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          metadata: {
            filename,
            chunkIndex: chunkIndex++
          }
        });
      }
      currentChunk = trimmedSentence;
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  // Push the last chunk if it exists
  if (currentChunk) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: {
        filename,
        chunkIndex: chunkIndex
      }
    });
  }
  
  return chunks;
} 