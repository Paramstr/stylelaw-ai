#!/usr/bin/env node

import { config } from 'dotenv'
import path from 'path'
import fs from 'fs/promises'
import { Index } from '@upstash/vector'
import { processFolder, upsertChunks } from '../app/lib/research/upserter';
import { chunkPDFDocument } from '../app/lib/research/chunker';
import { getEmbeddings } from '../app/lib/research/vectorizer';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

async function getSampleVector(pdfFolderPath: string): Promise<number[]> {
  const files = await fs.readdir(pdfFolderPath);
  const pdf2011 = files.find(f => f.startsWith('2011_'));
  
  if (!pdf2011) {
    throw new Error('No 2011 PDF found to use as sample');
  }
  
  console.log(`Using ${pdf2011} to generate sample vector...`);
  const chunks = await chunkPDFDocument(path.join(pdfFolderPath, pdf2011), pdf2011);
  const vectors = await getEmbeddings(chunks[0].content);
  return vectors[0];
}

async function countLocalPDFs(pdfFolderPath: string) {
  const files = await fs.readdir(pdfFolderPath);
  const yearCounts = new Map<string, number>();
  
  files.forEach(file => {
    if (!file.toLowerCase().endsWith('.pdf')) return;
    const year = file.substring(0, 4);
    if (!isNaN(parseInt(year))) {
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
    }
  });
  
  return yearCounts;
}

async function deleteExisting2011Entries(index: Index, sampleVector: number[]) {
  console.log('Analyzing database entries in family_court namespace...');
  try {
    // First do a test query to see what years we have
    const testResults = await index.query({
      vector: sampleVector,
      topK: 1000, // Get as many as we can
      includeMetadata: true
    }, { namespace: "family_court" }); // Pass namespace as options
    
    // Analyze years in database
    const dbYearCounts = new Map<string, number>();
    testResults.forEach(r => {
      const filename = r.metadata?.filename;
      if (typeof filename === 'string') {
        const year = filename.substring(0, 4);
        dbYearCounts.set(year, (dbYearCounts.get(year) || 0) + 1);
      }
    });
    
    // Get local PDF counts
    const localYearCounts = await countLocalPDFs("/Users/param-singh/Documents/My Projects/Param AI Law/nz_familycourt_cases");
    
    // Compare counts
    console.log('\nComparing database vs local PDFs:');
    console.log('Year  | Database | Local PDFs');
    console.log('------|-----------|------------');
    
    const allYears = new Set([
      ...Array.from(dbYearCounts.keys()),
      ...Array.from(localYearCounts.keys())
    ].sort());
    
    allYears.forEach(year => {
      const dbCount = dbYearCounts.get(year) || 0;
      const localCount = localYearCounts.get(year) || 0;
      console.log(`${year} |    ${dbCount.toString().padStart(5)}  |    ${localCount.toString().padStart(5)}`);
    });
    
    // Now try with filter for 2011
    console.log('\nTrying with filter for 2011...');
    const results = await index.query({
      vector: sampleVector,
      filter: "metadata.filename CONTAINS '2011'",
      topK: 1000,
      includeMetadata: true
    }, { namespace: "family_court" }); // Pass namespace as options
    
    const validEntries = results.filter(entry => {
      const filename = entry.metadata?.filename;
      // Double check it's a 2011 file (not just containing 2011 somewhere)
      return typeof filename === 'string' && filename.startsWith('2011_');
    });
    
    console.log(`Found ${validEntries.length} entries from 2011 (max 1000 shown)`);
    if (validEntries.length > 0) {
      console.log('Sample filenames:', validEntries.slice(0, 5).map(entry => entry.metadata?.filename));
    }
    
    if (validEntries.length === 0) {
      console.log('No 2011 entries found to delete');
      return;
    }
    
    // Confirm deletion
    const idsToDelete = validEntries.map(entry => String(entry.id));
    console.log(`\nAbout to delete ${idsToDelete.length} entries from 2011.`);
    console.log('Note: This will only delete the first 1000 entries if there are more.');
    console.log('Press Ctrl+C now to abort if this looks incorrect.');
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second pause
    
    // Delete in batches of 100
    const batchSize = 100;
    for (let i = 0; i < idsToDelete.length; i += batchSize) {
      const batch = idsToDelete.slice(i, i + batchSize);
      await index.delete(batch, { namespace: "family_court" }); // Pass namespace as options
      console.log(`Deleted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(idsToDelete.length/batchSize)}`);
    }
    
    console.log('Successfully deleted found 2011 entries');
    console.log('You may need to run this script multiple times if there are more than 1000 entries.');
  } catch (error) {
    console.error('Error deleting 2011 entries:', error);
    throw error;
  }
}

async function main() {
  const pdfFolderPath = "/Users/param-singh/Documents/My Projects/Param AI Law/nz_familycourt_cases";
  
  // Verify environment variables are loaded
  if (!process.env.VOYAGE_API_KEY) {
    console.error('Error: VOYAGE_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  if (!process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN) {
    console.error('Error: NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN not found in environment variables');
    process.exit(1);
  }

  if (!pdfFolderPath) {
    console.error('Please provide the path to the PDF folder');
    console.error('Usage: npx tsx scripts/upsert-pdfs-part2.ts <path-to-pdf-folder>');
    process.exit(1);
  }

  const startTime = Date.now();
  console.log('Starting deletion of 2011 entries');
  console.log('====================================================');
  console.log(`Folder: ${pdfFolderPath}`);
  console.log('====================================================\n');

  try {
    // Initialize Upstash Vector client
    const index = new Index({
      url: process.env.UPSTASH_VECTOR_URL!,
      token: process.env.UPSTASH_VECTOR_TOKEN!
    });

    // Get a sample vector from a 2011 PDF
    const sampleVector = await getSampleVector(pdfFolderPath);

    // Delete existing 2011 entries
    await deleteExisting2011Entries(index, sampleVector);
    
    console.log('\nDeletion phase complete.');
    
    // Comment out normal upsertion code for now
    /*
    // Get all PDF files and filter for 2011 onwards
    const files = await fs.readdir(pdfFolderPath);
    const pdfFiles = files
      .filter(file => {
        // Check if it's a PDF file
        if (!file.toLowerCase().endsWith('.pdf')) return false;
        
        // Get the year from filename (assuming format YYYY_*)
        const year = parseInt(file.substring(0, 4));
        
        // Include files from 2011 onwards
        return !isNaN(year) && year >= 2011;
      })
      .sort(); // Ensure alphabetical order
    
    if (pdfFiles.length === 0) {
      console.error('No PDF files from 2011 onwards found in the directory');
      process.exit(1);
    }

    console.log(`Found ${pdfFiles.length} PDF files from 2011 onwards to process\n`);
    
    // Process PDFs
    const chunks = await processFolder(pdfFolderPath, pdfFiles);
    
    if (chunks.length === 0) {
      console.error('No chunks were generated. Please check your PDF files.');
      process.exit(1);
    }

    // Upsert to vector store
    await upsertChunks(chunks);
    
    const totalDuration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    console.log('\n====================================================');
    console.log(`Total processing time: ${totalDuration} minutes`);
    console.log('====================================================');
    */
    
    process.exit(0);
  } catch (error) {
    console.error('\nFatal error:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('\nUncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('\nUnhandled rejection:', error);
  process.exit(1);
});

main(); 