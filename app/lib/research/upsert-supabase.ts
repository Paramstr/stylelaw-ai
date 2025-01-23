import path from 'path';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Required environment variables are missing.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function ensureStorageBucket() {
  const { data: buckets, error: listError } = await supabaseAdmin
    .storage
    .listBuckets();
  
  if (listError) throw listError;
  
  const pdfsBucket = buckets?.find(b => b.name === 'Law-Cases');
  
  if (!pdfsBucket) {
    const { data, error: createError } = await supabaseAdmin
      .storage
      .createBucket('Law-Cases', {
        public: false,
        fileSizeLimit: 52428800, // 50MB limit
      });
    
    if (createError) throw createError;
    console.log('Created new "Law-Cases" bucket');
  }
}

async function uploadPDFToSupabase(filePath: string) {
  const fileName = path.basename(filePath);
  const fileBuffer = await fs.readFile(filePath);
  
  try {
    const { data, error } = await supabaseAdmin
      .storage
      .from('Law-Cases')
      .upload(`documents/${fileName}`, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error('Upload error details:', error);
      throw error;
    }
    
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('Law-Cases')
      .getPublicUrl(`documents/${fileName}`);
      
    console.log(`✓ ${fileName} uploaded successfully`);
    return data;
  } catch (error) {
    console.error(`✗ Error uploading ${fileName}:`, error);
    throw error;
  }
}

async function main() {
  const pdfFolderPath = "/Users/param-singh/Documents/My Projects/Param AI Law/nz_familycourt_cases";

  if (!pdfFolderPath) {
    console.error('Please provide the path to the PDF folder');
    console.error('Usage: npx tsx app/lib/research/upsert-docs.ts <path-to-pdf-folder>');
    process.exit(1);
  }

  const startTime = Date.now();
  console.log('Starting PDF upload process to Supabase');
  console.log('=====================================');
  console.log(`Folder: ${pdfFolderPath}`);
  console.log('=====================================\n');

  try {
    // Ensure storage bucket exists
    await ensureStorageBucket();
    
    // Get all PDF files
    const files = await fs.readdir(pdfFolderPath);
    const pdfFiles = files.filter(file => {
      // Check if it's a PDF file
      if (!file.toLowerCase().endsWith('.pdf')) return false;
      
      // Exclude files that start with '2024_'
      if (file.startsWith('2024_')) return false;
      
      return true;
    });
    
    if (pdfFiles.length === 0) {
      console.error('No PDF files found in the directory');
      process.exit(1);
    }

    console.log(`Found ${pdfFiles.length} PDF files to process\n`);
    
    // Upload each file
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i];
      console.log(`[${i + 1}/${pdfFiles.length}] Processing: ${file}`);
      
      try {
        const filePath = path.join(pdfFolderPath, file);
        await uploadPDFToSupabase(filePath);
        successCount++;
      } catch (error) {
        failureCount++;
        // Continue with next file instead of failing completely
        continue;
      }
    }
    
    const totalDuration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    console.log('\n=====================================');
    console.log('Upload Summary:');
    console.log(`- Total files processed: ${pdfFiles.length}`);
    console.log(`- Successfully uploaded: ${successCount}`);
    console.log(`- Failed uploads: ${failureCount}`);
    console.log(`- Total processing time: ${totalDuration} minutes`);
    console.log('=====================================');
    
  } catch (error) {
    console.error('\nFatal error during PDF upload:', error);
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