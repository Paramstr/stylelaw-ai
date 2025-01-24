import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'Law-Cases';
const FOLDER_NAME = 'family-court';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    
    // Normalize filename to ensure it has .pdf extension
    const normalizedFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    const storageFilename = `${FOLDER_NAME}/${normalizedFilename}`;

    // Download PDF from Supabase storage
    const { data: pdfData, error: downloadError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .download(storageFilename);

    if (downloadError || !pdfData) {
      console.error('Error downloading PDF:', downloadError);
      return NextResponse.json(
        { error: 'PDF file not found' },
        { status: 404 }
      );
    }

    // Convert the blob to an array buffer
    const arrayBuffer = await pdfData.arrayBuffer();

    // Return the PDF with appropriate headers
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${normalizedFilename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'Failed to serve PDF' },
      { status: 500 }
    );
  }
} 