import { Redis } from '@upstash/redis';
import { processFolder, upsertChunks } from './upserter';
import { extractMetadata } from './metadata-extractor';
import { ProcessedChunk, CaseMetadata } from './types';
import path from 'path';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function batchProcessCases(directoryPath: string) {
  try {
    console.log('Starting batch processing of cases...');
    
    // Process all PDFs in the directory
    const chunks = await processFolder(directoryPath);
    console.log(`Found ${chunks.length} chunks from PDFs`);
    
    // Group chunks by filename
    const chunksByFile = chunks.reduce((acc, chunk) => {
      const filename = chunk.metadata.filename;
      if (!acc[filename]) {
        acc[filename] = [];
      }
      acc[filename].push(chunk);
      return acc;
    }, {} as Record<string, ProcessedChunk[]>);
    
    // Process each file
    for (const [filename, fileChunks] of Object.entries(chunksByFile)) {
      console.log(`Processing ${filename}...`);
      
      try {
        // Extract metadata
        const filePath = path.join(directoryPath, filename);
        const metadata = await extractMetadata(filePath, filename);
        
        // Store metadata in Redis
        const metadataKey = `case:metadata:${filename}`;
        await redis.set(metadataKey, JSON.stringify(metadata));
        console.log(`Stored metadata for ${filename}`);
        
        // Upsert chunks with vector embeddings
        await upsertChunks(fileChunks);
        console.log(`Uploaded chunks for ${filename}`);
      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
        // Continue with next file
        continue;
      }
    }
    
    console.log('Batch processing completed successfully');
  } catch (error) {
    console.error('Error in batch processing:', error);
    throw error;
  }
}

export async function getCaseMetadata(filename: string): Promise<CaseMetadata | null> {
  const metadataKey = `case:metadata:${filename}`;
  const metadata = await redis.get<string>(metadataKey);
  return metadata ? JSON.parse(metadata) : null;
} 