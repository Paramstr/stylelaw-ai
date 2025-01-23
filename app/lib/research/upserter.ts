import { Index } from '@upstash/vector'
import { getEmbeddings, getBM25Tokens } from './vectorizer'
import { chunkPDFDocument } from './chunker'
import path from 'path'
import fs from 'fs/promises'

interface ProcessedChunk {
  content: string;
  metadata: {
    filename: string;
    chunkIndex: number;
  };
}

export async function processFolder(directoryPath: string, filteredFiles?: string[]): Promise<ProcessedChunk[]> {
  const files = await fs.readdir(directoryPath);
  const pdfFiles = filteredFiles || files.filter(file => path.extname(file).toLowerCase() === '.pdf');
  const allChunks: ProcessedChunk[] = [];
  
  console.log(`Found ${pdfFiles.length} PDF files to process`);
  
  for (let i = 0; i < pdfFiles.length; i++) {
    const pdfFile = pdfFiles[i];
    console.log(`Processing file ${i + 1}/${pdfFiles.length}: ${pdfFile}`);
    
    try {
      const filePath = path.join(directoryPath, pdfFile);
      const chunks = await chunkPDFDocument(filePath, pdfFile);
      console.log(`  ✓ Generated ${chunks.length} chunks from ${pdfFile}`);
      allChunks.push(...chunks);
    } catch (error) {
      console.error(`  ✗ Error processing ${pdfFile}:`, error);
      // Continue with next file instead of failing completely
      continue;
    }
  }
  
  console.log(`\nProcessing complete:`);
  console.log(`- Total files processed: ${pdfFiles.length}`);
  console.log(`- Total chunks generated: ${allChunks.length}`);
  
  return allChunks;
}

export async function upsertChunks(chunks: ProcessedChunk[], options?: { namespace?: string }) {
  console.log('\nStarting upsertion process:');
  console.log(`- Total chunks to upsert: ${chunks.length}`);
  
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.UPSTASH_VECTOR_TOKEN!
  });

  const namespace = options?.namespace ? index.namespace(options.namespace) : index;

  const batchSize = 100;
  const totalBatches = Math.ceil(chunks.length / batchSize);
  let successfulUpserts = 0;
  let failedUpserts = 0;
  
  for (let i = 0; i < chunks.length; i += batchSize) {
    const currentBatch = Math.floor(i / batchSize) + 1;
    console.log(`\nProcessing batch ${currentBatch}/${totalBatches}`);
    
    const batchChunks = chunks.slice(i, i + batchSize);
    const batchStartTime = Date.now();
    
    try {
      const batchOperations = await Promise.all(
        batchChunks.map(async (chunk) => {
          try {
            const vectors = await getEmbeddings(chunk.content);
            const sparseVector = await getBM25Tokens(chunk.content);
            const cleanFilename = chunk.metadata.filename.replace('.pdf', '');
            return {
              id: `${cleanFilename}-${chunk.metadata.chunkIndex}`,
              vector: vectors[0],
              sparseVector,
              metadata: {
                ...chunk.metadata,
                filename: cleanFilename,
                content: chunk.content
              }
            };
          } catch (error) {
            console.error(`  ✗ Error processing chunk from ${chunk.metadata.filename}:`, error);
            failedUpserts++;
            return null;
          }
        })
      );
      
      // Filter out any failed operations
      const validOperations = batchOperations.filter(op => op !== null);
      
      if (validOperations.length > 0) {
        await namespace.upsert(validOperations);
        successfulUpserts += validOperations.length;
      }
      
      const batchDuration = ((Date.now() - batchStartTime) / 1000).toFixed(2);
      console.log(`  ✓ Batch ${currentBatch} complete in ${batchDuration}s`);
      console.log(`    - Processed: ${batchChunks.length} chunks`);
      console.log(`    - Successful: ${validOperations.length}`);
      console.log(`    - Failed: ${batchChunks.length - validOperations.length}`);
      
    } catch (error) {
      console.error(`  ✗ Batch ${currentBatch} failed:`, error);
      failedUpserts += batchChunks.length;
    }
  }
  
  console.log('\nUpsertion process complete:');
  console.log(`- Total chunks processed: ${chunks.length}`);
  console.log(`- Successfully upserted: ${successfulUpserts}`);
  console.log(`- Failed to upsert: ${failedUpserts}`);
}

export async function query(queryText: string, topK: number = 5) {
  console.log('Starting query function with:', { queryText, topK });
  
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.UPSTASH_VECTOR_TOKEN!
  });
  console.log('Index initialized');

  try {
    console.log('Getting embeddings for query');
    const denseVector = (await getEmbeddings(queryText))[0];
    console.log('Dense vector obtained');
    
    console.log('Getting BM25 tokens');
    const sparseVector = await getBM25Tokens(queryText);
    console.log('Sparse vector obtained');
    
    console.log('Querying index');
    const results = await index.query({
      vector: denseVector,
      sparseVector: sparseVector,
      topK,
      includeMetadata: true
    });
    console.log('Query completed, results:', results);

    return results;
  } catch (error) {
    console.error('Error in query function:', error);
    throw error;
  }
}

// USAGE
//const chunksProcessed = await bulkUploadDocuments('./path/to/pdf/folder');