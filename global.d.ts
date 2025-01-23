declare module 'wink-porter2-stemmer' {
  function stem(word: string): string;
  export default stem;
}

declare module 'wink-tokenizer' {
  class WinkTokenizer {
    tokenize(text: string): { value: string; tag: string }[];
  }
  export default WinkTokenizer;
}

declare module 'okapibm25' {
  function BM25(documents: string[], terms: string[], options: { k1: number; b: number }): number[];
  export default BM25;
} 