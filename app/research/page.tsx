'use client'

import { useState } from 'react'
import { NavHeader } from '../components/nav-header'
import { SiteFooter } from '../components/site-footer'
import { FilterSection } from '../components/filter-section'
import { SearchBar } from '../components/search-bar'
import CaseSearchResult from '../components/case-search-result'
import { searchDocuments } from '../lib/research/search-client'
import type { CaseData } from '@/../types/caseData'

interface SearchResult {
  id: string
  score: number
  metadata: CaseData
}

interface RawSearchResult {
  id: string
  score: number
}

export default function ResearchPage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [currentQuery, setCurrentQuery] = useState('')
  const [resultsCount, setResultsCount] = useState(10)

  // Fetch metadata for a single case
  const fetchCaseMetadata = async (caseId: string): Promise<CaseData> => {
    // Remove chunk number from ID (e.g., "1999_NZFC1-0" -> "1999_NZFC1")
    console.log('Fetching metadata for case ID:', caseId);
    const filename = caseId.split('-')[0];
    
    const response = await fetch(`/api/case-metadata?filename=${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata for case ${filename}`);
    }
    return response.json();
  }

  const handleSearch = async (searchText: string) => {
    if (!searchText.trim()) return
    
    console.log('Starting search in page component:', { searchText, resultsCount });
    setIsSearching(true)
    setError('')
    setResults([])
    setCurrentQuery(searchText.trim())
    
    try {
      // First do the actual search to get results
      console.log('Calling searchDocuments...');
      const searchResults = await searchDocuments(searchText.trim(), resultsCount) as RawSearchResult[];
      
      // Fetch metadata for each unique case
      const uniqueCaseIds = new Set(searchResults.map(result => result.id.split('-')[0]));
      const metadataPromises = Array.from(uniqueCaseIds).map(id => fetchCaseMetadata(id));
      
      // Wait for all metadata to be fetched
      const metadataResults = await Promise.allSettled(metadataPromises);
      
      // Create a map of case IDs to their metadata
      const metadataMap = new Map<string, CaseData>();
      Array.from(uniqueCaseIds).forEach((caseId, index) => {
        const result = metadataResults[index];
        if (result.status === 'fulfilled') {
          metadataMap.set(caseId, result.value);
        }
      });

      // Map search results to include metadata
      const mappedResults = searchResults.map((result: RawSearchResult) => {
        const caseId = result.id.split('-')[0];
        const metadata = metadataMap.get(caseId);
        
        if (!metadata) {
          console.warn(`No metadata found for case ${caseId}`);
        }
        
        return {
          id: result.id,
          score: result.score,
          metadata: metadata || {} as CaseData // Fallback to empty object if metadata not found
        };
      }).filter(result => Object.keys(result.metadata).length > 0); // Filter out results without metadata

      console.log('Search completed:', { 
        resultsCount: mappedResults.length,
        hasResults: !!mappedResults.length
      });
      
      setResults(mappedResults)
    } catch (error) {
      console.error('Search error in page component:', error)
      setError(error instanceof Error ? error.message : 'Search failed')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultsCountChange = (count: number) => {
    console.log('Results count changed:', { count });
    setResultsCount(count);
    if (currentQuery) {
      handleSearch(currentQuery);
    }
  };

  const hasResults = results.length > 0 || isSearching;

  return (
    <div className="min-h-screen bg-white text-black relative">
      <NavHeader title="DONNA | RESEARCH" />
      
      <main className="min-h-screen pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Search controls section */}
          <div className={`${!hasResults && 'min-h-[70vh] flex flex-col justify-center'}`}>
            <div className="w-full max-w-4xl mx-auto">
              <div className="mb-6">
                <FilterSection />
              </div>
              <div className="space-y-6">
                <SearchBar onSearch={handleSearch} />
                {error && (
                  <div className="text-red-500 text-center p-2 rounded bg-red-50">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results section */}
          {hasResults && (
            <div className="mt-8 space-y-8">
              {results.map((result) => (
                <CaseSearchResult 
                  key={result.id}
                  caseData={result.metadata}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="h-32 bg-cover bg-center" />
        <SiteFooter />
      </div>
    </div>
  )
}

