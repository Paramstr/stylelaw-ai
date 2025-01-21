import { Index, SparseVector } from '@upstash/vector'

import { Vectorizer } from './vectorizer'
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

export class DocumentUpserter {
  protected index: Index;
  protected vectorizer: Vectorizer;
  
  constructor() {
    this.index = new Index({
      url: process.env.UPSTASH_VECTOR_URL!,
      token: process.env.UPSTASH_VECTOR_TOKEN!
    });
    
    this.vectorizer = new Vectorizer();
  }
  
  async processFolder(directoryPath: string): Promise<ProcessedChunk[]> {
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

  async upsertChunks(chunks: ProcessedChunk[]) {
    const batchSize = 100; // Adjust based on your needs
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchChunks = chunks.slice(i, i + batchSize);
      const batchOperations = await Promise.all(
        batchChunks.map(async (chunk) => {
          const vectors = await this.vectorizer.getEmbeddings(chunk.content);
          return {
            id: `${chunk.metadata.filename}-${chunk.metadata.chunkIndex}`,
            vector: vectors[0],
            sparseVector: this.vectorizer.getBM25Tokens(chunk.content),
            metadata: {
              ...chunk.metadata,
              content: chunk.content
            }
          };
        })
      );
      
      await this.index.upsert(batchOperations);
      console.log(`Upserted batch ${i/batchSize + 1} of ${Math.ceil(chunks.length/batchSize)}`);
    }
  }

  async query(queryText: string, topK: number = 5) {
    const denseVector = (await this.vectorizer.getEmbeddings(queryText))[0];
    
    const sparseVector = this.vectorizer.getBM25Tokens(queryText);
    
    const results = await this.index.query({
      vector: denseVector,
      sparseVector: sparseVector,
      topK,
      includeMetadata: true
    });

    return results;
  }
} 

// USAGE
//const chunksProcessed = await bulkUploadDocuments('./path/to/pdf/folder');