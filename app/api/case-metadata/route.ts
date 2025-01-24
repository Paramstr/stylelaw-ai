import { NextRequest, NextResponse } from 'next/server';
import { extractMetadataWithClaude } from '@/lib/research/claude-metadata-extractor';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
// At the top of case-metadata/route.ts
import { POST as claudeApiHandler } from '@/api/claude/route';  // Adjust the import path based on your file structure

// Constants
const BUCKET_NAME = 'Law-Cases';
const FOLDER_NAME = 'family-court';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validate filename format (e.g., 1997_NZFC1 or 1997_NZFC1.pdf)
function isValidFilename(filename: string): boolean {
  const pattern = /^\d{4}_NZFC\d+(?:\.pdf)?$/;
  return pattern.test(filename);
}

// Normalize filename for storage (remove .pdf if present)
function normalizeFilename(filename: string): string {
  return filename.replace(/\.pdf$/, '');
}

// Get storage filename (append .pdf)
function getStorageFilename(filename: string): string {
  return filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
}

export async function POST(request: NextRequest) {
  console.log('Metadata API route called');
  
  const body = await request.json();
  const filename = body.filename;


  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing required environment variables');
  }

  if (!filename) {
    console.error('No filename provided');
    return NextResponse.json(
      { error: 'Filename parameter is required' },
      { status: 400 }
    );
  }

  console.log('Processing request for filename:', filename);


  if (!isValidFilename(filename)) {
    console.error('Invalid filename format:', filename);
    return NextResponse.json(
      { error: 'Invalid filename format. Expected format: YYYY_NZFCXXX or YYYY_NZFCXXX.pdf' },
      { status: 400 }
    );
  }

  const normalizedFilename = normalizeFilename(filename);
  console.log('Normalized filename:', normalizedFilename);

  try {
    // 1. First check if metadata exists in Supabase
    console.log('Checking Supabase for existing metadata...');
    const { data: existingMetadata, error: fetchError } = await supabase
      .from('case_metadata')
      .select('*')
      .eq('filename', normalizedFilename)
      .single();

    console.log('Existing metadata:', existingMetadata);
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching from Supabase:', fetchError);
      throw fetchError;
    }

    if (existingMetadata) {
      console.log('Found existing metadata for:', normalizedFilename);
      return NextResponse.json(existingMetadata.metadata);
    }

    // 2. Download PDF from Supabase bucket
    console.log('Downloading PDF from storage bucket:', BUCKET_NAME);
    const storageFilename = `${FOLDER_NAME}/${getStorageFilename(normalizedFilename)}`;
    console.log('Storage filename:', storageFilename);
    
    const { data: pdfData, error: downloadError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .download(storageFilename);

    if (downloadError || !pdfData) {
      console.error('Error downloading PDF:', downloadError);
      return NextResponse.json(
        { error: `PDF file not found in storage bucket: ${BUCKET_NAME}` },
        { status: 404 }
      );
    }

    console.log('PDF downloaded successfully, size:', pdfData.size);

    // 3. Extract metadata using Claude
    console.log('Extracting metadata using Claude...');

    const arrayBuffer = await pdfData.arrayBuffer();
    const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');



    // Convert PDF to text
    console.log('PDF CHECKPOINT 1: extracted text');
    

    // Call Claude API route
    // Replace the fetch call with direct handler invocation
    const claudeResponse = await claudeApiHandler(
      new NextRequest('http://localhost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: {
            type: 'extract_metadata',
            content: pdfBase64,
          }
        })
      })
    );

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.json();
      console.error('Claude API error:', errorData);
      throw new Error(errorData.error || 'Claude API failed');
    }

    const metadata = await claudeResponse.json();

    // Add the pdfFile field and pdfData to metadata
    metadata.pdfFile = normalizedFilename;
    metadata.pdfBase64 = pdfBase64;  // Add the base64 encoded PDF data

    console.log('Metadata extracted successfully');

    // 4. Store the extracted metadata in Supabase
    console.log('Storing metadata in Supabase...');
    const { error: insertError } = await supabase
      .from('case_metadata')
      .insert([{
        filename: normalizedFilename,
        metadata: metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error storing metadata in Supabase:', insertError);
      // Continue anyway to return the metadata to the user
    } else {
      console.log('Metadata stored successfully');
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error in metadata pipeline:', error);
    // Determine if it's a Claude overload error
    const isOverloaded = error instanceof Error && 
      error.message.includes('overloaded');
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to retrieve or extract case metadata',
        isOverloaded: isOverloaded,
        retryAfter: isOverloaded ? 5000 : undefined // Suggest retry after 5 seconds if overloaded
      },
      { 
        status: isOverloaded ? 503 : 500,
        headers: isOverloaded ? { 'Retry-After': '5' } : undefined
      }
    );
  }
} 