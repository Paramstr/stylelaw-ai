import path from 'path';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

// Load environment variables from .env.local

// Initialize Supabase client with service role key for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Make sure to use the service role key, not the anon key
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
    console.log('Created new "pdfs" bucket');
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
      .from('pdfs')
      .getPublicUrl(`documents/${fileName}`);
      
    console.log(`File uploaded successfully. URL: ${publicUrl}`);
    return data;
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting PDF upload process...');
    
    // Ensure storage bucket exists
    await ensureStorageBucket();
    
    // Define the path to test PDFs
    const testPdfsDir = path.join(process.cwd(), 'app', 'tests', 'test-pdfs');
    console.log(`Processing documents from: ${testPdfsDir}`);
    
    // Get all PDF files
    const files = await fs.readdir(testPdfsDir);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      console.log('No PDF files found in the directory');
      return;
    }
    
    // Upload each file
    for (const file of pdfFiles) {
      console.log(`Uploading ${file}...`);
      const filePath = path.join(testPdfsDir, file);
      await uploadPDFToSupabase(filePath);
      console.log(`Successfully uploaded ${file} to Supabase storage`);
    }
    
    console.log('Completed uploading all PDFs');
    
  } catch (error) {
    console.error('Error during PDF upload:', error);
    process.exit(1);
  }
}

// Run the script
main();