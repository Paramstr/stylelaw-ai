import { NextRequest, NextResponse } from 'next/server';
import { getCaseMetadata } from '@/lib/research/batch-processor';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename parameter is required' },
      { status: 400 }
    );
  }

  try {
    const metadata = await getCaseMetadata(filename);
    
    if (!metadata) {
      return NextResponse.json(
        { error: 'Metadata not found for the specified case' },
        { status: 404 }
      );
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching case metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case metadata' },
      { status: 500 }
    );
  }
} 