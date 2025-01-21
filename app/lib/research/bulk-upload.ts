// scripts/bulk-upload.ts
import { DocumentUpserter } from './upserter'
import path from 'path'

export async function bulkUploadDocuments(directoryPath: string) {
  const upserter = new DocumentUpserter();
  
  try {
    console.log('Processing documents...');
    const processedChunks = await upserter.processFolder(directoryPath);
    
    console.log(`Found ${processedChunks.length} chunks across all documents`);
    
    console.log('Upserting chunks to vector store...');
    await upserter.upsertChunks(processedChunks);
    
    console.log('Bulk upload completed successfully');
    return processedChunks.length;
  } catch (error) {
    console.error('Error during bulk upload:', error);
    throw error;
  }
}
