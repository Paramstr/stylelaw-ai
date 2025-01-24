import { NextRequest, NextResponse } from 'next/server';
import { extractMetadataWithClaude } from '@/lib/research/claude-metadata-extractor';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

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

export async function GET(request: NextRequest) {
  console.log('Metadata API route called');
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('filename');

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
    const extractedMetadata = await extractMetadataWithClaude(pdfData, normalizedFilename);
    console.log('Metadata extracted successfully');

    // 4. Store the extracted metadata in Supabase
    console.log('Storing metadata in Supabase...');
    const { error: insertError } = await supabase
      .from('case_metadata')
      .insert([{
        filename: normalizedFilename,
        metadata: extractedMetadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error storing metadata in Supabase:', insertError);
      // Continue anyway to return the metadata to the user
    } else {
      console.log('Metadata stored successfully');
    }

    return NextResponse.json(extractedMetadata);
  } catch (error) {
    console.error('Error in metadata pipeline:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve or extract case metadata' },
      { status: 500 }
    );
  }
} 