import type { CaseData } from '@/../types/caseData'

export interface SearchResult {
  id: string;
  score: number;
  metadata: CaseData;
  chunk: {
    content: string;
    filename: string;
    chunkIndex: number;
  };
  themes?: Array<{
    theme_name: string;
    strength: number;
  }>;
  relevance?: {
    score: number;
    reason: string;
  };
}

export interface ProcessedCase {
  metadata: CaseData;
  chunks: ProcessedChunk[];
}

export interface ProcessedChunk {
  content: string;
  metadata: {
    filename: string;
    chunkIndex: number;
  };
} 