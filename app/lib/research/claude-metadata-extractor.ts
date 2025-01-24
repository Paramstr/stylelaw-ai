import { CaseData } from "@/../types/caseData";
import { extractTextFromPDF } from "./pdf-parser";

export async function extractMetadataWithClaude(pdfData: Blob, filename: string): Promise<CaseData> {
  console.log('Starting metadata extraction for:', filename);
  
  try {
    // Convert PDF to text
    console.log('Converting PDF to text...');
    const arrayBuffer = await pdfData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractTextFromPDF(buffer);
    console.log('PDF text extracted, length:', text.length);

    // Call our Claude API route
    console.log('Calling Claude API route...');
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: {
          type: 'extract_metadata',
          content: text,
        },
        systemPrompt: "You are a legal document analyzer that extracts structured metadata from case law documents. You are extremely precise and accurate in your extractions.",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API request failed:', error);
      throw new Error(error.message || 'Failed to extract metadata');
    }

    console.log('Received response from Claude API');
    const extractedMetadata = await response.json() as CaseData;
    console.log('Successfully parsed metadata for:', filename);
    
    return {
      ...extractedMetadata,
      pdfFile: `${filename}.pdf`, // Always store with .pdf extension
    };
  } catch (error) {
    console.error('Error in metadata extraction:', error);
    throw error;
  }
} 