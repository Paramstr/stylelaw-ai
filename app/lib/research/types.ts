declare module 'wink-tokenizer' {
  interface Token {
    value: string;
    tag: string;
  }

  class Tokenizer {
    tokenize(text: string): Token[];
  }

  export default Tokenizer;
}

declare module 'wink-porter2-stemmer' {
  function stem(word: string): string;
  export default stem;
}

declare module 'okapibm25' {
  function BM25(documents: string[], terms: string[], options: { k1: number; b: number }): number[];
  export default BM25;
} 