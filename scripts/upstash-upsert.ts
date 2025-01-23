#!/usr/bin/env node

import { config } from 'dotenv'
import path from 'path'
import fs from 'fs/promises'
import { Index } from '@upstash/vector'
import { processFolder, upsertChunks } from '../app/lib/research/upserter';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

const PROGRESS_FILE = 'upsert-progress.json';

interface ProgressData {
  lastProcessedFile: string | null;
  processedFiles: string[];
  errors: Array<{ file: string; error: string }>;
  startTime: number;
  lastUpdateTime: number;
}

async function loadProgress(): Promise<ProgressData> {
  try {
    const data = await fs.readFile(PROGRESS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      lastProcessedFile: null,
      processedFiles: [],
      errors: [],
      startTime: Date.now(),
      lastUpdateTime: Date.now()
    };
  }
}

async function saveProgress(progress: ProgressData) {
  progress.lastUpdateTime = Date.now();
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Add type for error handling
type ErrorWithMessage = {
  message: string;
  toString(): string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return String(error);
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
    console.error('Usage: npx tsx scripts/upsert-pdfs.ts <path-to-pdf-folder>');
    process.exit(1);
  }

  // Initialize Upstash Vector client and get family_court namespace
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.UPSTASH_VECTOR_TOKEN!
  });
  const namespace = index.namespace("family_court");

  // Load progress
  const progress = await loadProgress();
  if (progress.processedFiles.length > 0) {
    console.log(`Resuming from previous progress. Already processed ${progress.processedFiles.length} files.`);
    console.log('Last processed file:', progress.lastProcessedFile);
    if (progress.errors.length > 0) {
      console.log('Previous errors:', progress.errors);
    }
  }

  const startTime = progress.startTime || Date.now();
  console.log('Starting PDF processing pipeline');
  console.log('================================');
  console.log(`Folder: ${pdfFolderPath}`);
  console.log('================================\n');

  try {
    // Get all PDF files and sort them chronologically
    const files = await fs.readdir(pdfFolderPath);
    const pdfFiles = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .sort(); // Ensures chronological order since filenames start with year

    // Filter out already processed files
    const remainingFiles = pdfFiles.filter(f => !progress.processedFiles.includes(f));
    console.log(`Found ${remainingFiles.length} files left to process`);

    // Process files one by one
    for (const file of remainingFiles) {
      try {
        console.log(`\nProcessing ${file}...`);
        const filePath = path.join(pdfFolderPath, file);
        
        // Process single file
        const chunks = await processFolder(pdfFolderPath, [file]);
        
        if (chunks.length > 0) {
          // Upsert to vector store using namespace
          await upsertChunks(chunks, { namespace: "family_court" });
          
          // Update progress
          progress.lastProcessedFile = file;
          progress.processedFiles.push(file);
          await saveProgress(progress);
          
          console.log(`✓ Successfully processed ${file} (${chunks.length} chunks)`);
        } else {
          throw new Error('No chunks generated');
        }
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error);
        progress.errors.push({ file, error: getErrorMessage(error) });
        await saveProgress(progress);
        // Continue with next file instead of failing completely
        continue;
      }
    }
    
    const totalDuration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    console.log('\n================================');
    console.log('Processing Summary:');
    console.log(`- Total files processed: ${progress.processedFiles.length}`);
    console.log(`- Files with errors: ${progress.errors.length}`);
    console.log(`- Total processing time: ${totalDuration} minutes`);
    console.log('================================');
    
    if (progress.errors.length > 0) {
      console.log('\nFiles that had errors:');
      progress.errors.forEach(({ file, error }) => {
        console.log(`- ${file}: ${error}`);
      });
    }
  } catch (error) {
    console.error('\nFatal error in processing pipeline:', error);
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