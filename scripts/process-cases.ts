#!/usr/bin/env tsx

import { config } from 'dotenv';
import { batchProcessCases } from '../app/lib/research/batch-processor';
import path from 'path';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: tsx scripts/process-cases.ts <path-to-pdf-directory>');
    process.exit(1);
  }

  const pdfDir = path.resolve(args[0]);
  console.log(`Processing PDFs from directory: ${pdfDir}`);

  try {
    await batchProcessCases(pdfDir);
    console.log('Processing completed successfully');
  } catch (error) {
    console.error('Error processing cases:', error);
    process.exit(1);
  }
}

main(); 