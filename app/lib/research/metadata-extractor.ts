import { Groq } from "groq-sdk";
import { CaseMetadata } from "./types";
import { chunkPDFDocument } from "./chunker";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const METADATA_EXTRACTION_PROMPT = `You are a legal document analyzer. Extract the following metadata from the given legal case text. Format the response as a JSON object matching this TypeScript interface:

interface CaseMetadata {
  title: string;
  citation: string;
  date: string;
  court: string;
  parties: {
    applicant: string;
    respondent: string;
  };
  judges: string[];
  lawyers: {
    applicant: string[];
    respondent: string[];
  };
  subjectMatter: string[];
  keywords: string[];
}

Rules:
1. Extract ONLY factual information present in the text
2. Use empty arrays [] or empty strings "" if information is not found
3. Format dates as ISO strings (YYYY-MM-DD)
4. Include complete names where available
5. For subject matter and keywords, extract main legal topics and key issues

Legal case text:
`;

export async function extractMetadata(pdfPath: string, filename: string): Promise<CaseMetadata> {
  // Get first chunk which typically contains the header information
  const chunks = await chunkPDFDocument(pdfPath, filename);
  const headerText = chunks[0].content;

  // Extract metadata using Groq
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a legal document analyzer that extracts structured metadata from case law documents.",
      },
      {
        role: "user",
        content: METADATA_EXTRACTION_PROMPT + headerText,
      },
    ],
    model: "mixtral-8x7b-32768",
    temperature: 0.1,
    max_tokens: 1000,
  });

  try {
    const extractedMetadata = JSON.parse(completion.choices[0]?.message?.content || "{}");
    
    return {
      ...extractedMetadata,
      filename,
      uploadedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to parse metadata response:", error);
    throw new Error("Failed to extract metadata from case document");
  }
} 