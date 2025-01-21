import axios from 'axios';
import { chunkPDFDocument    } from './chunker';
import BM25 from 'okapibm25';
import natural from 'natural';

export class Vectorizer {   
  private readonly CHUNK_SIZE = 8800; // Tokens per chunk
  private readonly MAX_BATCH_SIZE = 32; // Maximum chunks per API call
 

  private async sendEmbeddingsRequest(input: string[], model: string, input_type: string): Promise<number[][]> {
    const url = 'https://api.voyageai.com/v1/embeddings';
    const headers = {
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
      'content-type': 'application/json'
    };
    
    const data = {
      input,
      model,
      input_type
    };
    
    // Add debug logging
    console.log('Debug: API Key present:', !!process.env.VOYAGE_API_KEY);
    console.log('Debug: API Key length:', process.env.VOYAGE_API_KEY?.length);
    console.log('Debug: Headers:', JSON.stringify(headers, null, 2));
    console.log('Debug: Request Data:', JSON.stringify(data, null, 2));

    try {
      console.log('Debug: Sending request to:', url);
      const response = await axios.post(url, data, { headers });
      // The API returns embeddings in data.data[0].embedding
      return [response.data.data[0].embedding]; // Return as array of arrays
    } catch (error) {
      const err = error as Error;
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      console.error('Full error:', err);
      throw err;
    }
  }

  async getEmbeddings(text: string): Promise<number[][]> {
    const chunks = [text];
    const embeddings: number[][] = [];
    
    for (let i = 0; i < chunks.length; i += this.MAX_BATCH_SIZE) {
      const batchChunks = chunks.slice(i, i + this.MAX_BATCH_SIZE);
      
      try {
        const response = await this.sendEmbeddingsRequest(batchChunks, "voyage-law-2", "document");
        embeddings.push(...response);
      } catch (error) {
        throw error;
      }
    }
    
    return embeddings;
  }

  // BM25-style tokenization
  getBM25Tokens(text: string): { indices: number[]; values: number[] } {
    const tokenizer = new natural.WordTokenizer();
    const stemmer = natural.PorterStemmer;
    
    // Tokenize and stem the input text
    const tokens = tokenizer.tokenize(text.toLowerCase())
      ?.map(token => stemmer.stem(token))
      .filter(Boolean) ?? [];
    
    // Create a map of terms to their positions in our sparse vector
    const termToIndex = new Map<string, number>();
    const uniqueTerms = Array.from(new Set(tokens));
    uniqueTerms.forEach((term, index) => {
      termToIndex.set(term, index);
    });
    
    // Calculate BM25 scores using the term as both document and query
    // This gives us the term importance in the context of this document
    const scores = BM25([tokens.join(' ')], uniqueTerms, {
      k1: 1.2, // Standard BM25 parameter
      b: 0.75  // Standard BM25 parameter
    }) as number[]; // Type assertion to number[]
    
    // Convert to sparse vector format
    const indices: number[] = [];
    const values: number[] = [];
    
    uniqueTerms.forEach((term, index) => {
      const score = scores[0]; // We only have one document
      if (score > 0) {
        indices.push(termToIndex.get(term)!);
        values.push(score);
      }
    });
    
    return { indices, values };
  }
} 