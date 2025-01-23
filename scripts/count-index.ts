#!/usr/bin/env node

import { config } from 'dotenv'
import path from 'path'
import { Index } from '@upstash/vector'

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  // Verify environment variables are loaded
  if (!process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN) {
    console.error('Error: NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN not found in environment variables');
    process.exit(1);
  }

  console.log('Connecting to Upstash Vector index...');
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN!
  });

  try {
    const stats = await index.info();
    console.log('\nIndex Statistics:');
    console.log('================');
    console.log(`Total vectors: ${stats.vectorCount}`);
    console.log(`Dimension: ${stats.dimension}`);
    console.log(`Index size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('Error getting index statistics:', error);
    process.exit(1);
  }
}

main(); 