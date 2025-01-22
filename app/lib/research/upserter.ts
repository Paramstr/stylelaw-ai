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

export async function processFolder(directoryPath: string): Promise<ProcessedChunk[]> {
  const files = await fs.readdir(directoryPath);
  const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
  const allChunks: ProcessedChunk[] = [];
  
  for (const pdfFile of pdfFiles) {
    const filePath = path.join(directoryPath, pdfFile);
    const chunks = await chunkPDFDocument(filePath, pdfFile);
    allChunks.push(...chunks);
  }
  
  return allChunks;
}

export async function upsertChunks(chunks: ProcessedChunk[]) {
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.UPSTASH_VECTOR_TOKEN!
  });

  const batchSize = 100;
  
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batchChunks = chunks.slice(i, i + batchSize);
    const batchOperations = await Promise.all(
      batchChunks.map(async (chunk) => {
        const vectors = await getEmbeddings(chunk.content);
        const sparseVector = await getBM25Tokens(chunk.content);
        return {
          id: `${chunk.metadata.filename}-${chunk.metadata.chunkIndex}`,
          vector: vectors[0],
          sparseVector,
          metadata: {
            ...chunk.metadata,
            content: chunk.content
          }
        };
      })
    );
    
    await index.upsert(batchOperations);
    console.log(`Upserted batch ${i/batchSize + 1} of ${Math.ceil(chunks.length/batchSize)}`);
  }
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