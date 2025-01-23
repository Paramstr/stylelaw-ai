import axios, { AxiosError } from 'axios';
import { chunkPDFDocument } from './chunker';
import BM25 from 'okapibm25';
import winkTokenizer from 'wink-tokenizer';
import porterStemmer from 'wink-porter2-stemmer';

const CHUNK_SIZE = 8800;
const MAX_BATCH_SIZE = 32;

async function sendEmbeddingsRequest(input: string[], model: string, input_type: string): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    console.error('Missing VOYAGE_API_KEY in environment variables');
    throw new Error('Server configuration error: Voyage API key is missing');
  }

  console.log('Starting embeddings request with:', {
    inputLength: input.length,
    model,
    input_type,
  });

  const url = 'https://api.voyageai.com/v1/embeddings';
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'content-type': 'application/json'
  };
  
  const data = { input, model, input_type };
  
  try {
    console.log('Sending request to Voyage AI');
    const response = await axios.post(url, data, { headers });
    console.log('Received response from Voyage AI');
    return [response.data.data[0].embedding];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Voyage API Error:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers
      });
    } else {
      console.error('Non-Axios error:', error);
    }
    throw error;
  }
}

export async function getEmbeddings(text: string): Promise<number[][]> {
  const chunks = [text];
  const embeddings: number[][] = [];
  
  for (let i = 0; i < chunks.length; i += MAX_BATCH_SIZE) {
    const batchChunks = chunks.slice(i, i + MAX_BATCH_SIZE);
    const response = await sendEmbeddingsRequest(batchChunks, "voyage-law-2", "document");
    embeddings.push(...response);
  }
  
  return embeddings;
}

export async function getBM25Tokens(text: string): Promise<{ indices: number[]; values: number[] }> {
  const tokenizer = new winkTokenizer();
  
  // Tokenize and stem the input text
  const tokens = tokenizer.tokenize(text.toLowerCase())
    .filter(token => token.tag === 'word')
    .map(token => porterStemmer(token.value))
    .filter(Boolean);
  
  // Create a map of terms to their frequencies
  const termFreq = new Map<string, number>();
  tokens.forEach(term => {
    termFreq.set(term, (termFreq.get(term) || 0) + 1);
  });
  
  // Convert to sparse vector format where indices are term positions
  // and values are term frequencies (we'll let Upstash handle the IDF part)
  const uniqueTerms = Array.from(termFreq.keys()).sort();
  const indices: number[] = [];
  const values: number[] = [];
  
  uniqueTerms.forEach((term, index) => {
    const tf = termFreq.get(term)!;
    // Apply BM25-style term frequency saturation
    const k1 = 1.2;
    const normalizedTf = (tf * (k1 + 1)) / (tf + k1);
    
    indices.push(index);
    values.push(normalizedTf);
  });
  
  return { indices, values };
} 