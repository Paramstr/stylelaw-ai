
export interface CaseMetadata {
  // Basic case information
  title: string;
  citation: string;
  date: string;
  court: string;
  
  // Parties involved
  parties: {
    applicant: string;
    respondent: string;
  };
  
  // Case details
  judges: string[];
  lawyers: {
    applicant: string[];
    respondent: string[];
  };
  
  // Case subject matter
  subjectMatter: string[];
  keywords: string[];
  
  // Document info
  filename: string;
  uploadedAt: string;
  lastUpdated: string;
}

export interface ProcessedCase {
  metadata: CaseMetadata;
  chunks: ProcessedChunk[];
}

export interface ProcessedChunk {
  content: string;
  metadata: {
    filename: string;
    chunkIndex: number;
  };
} 