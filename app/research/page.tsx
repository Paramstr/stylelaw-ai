'use client'

import { useState, useCallback } from 'react'
import { NavHeader } from '../components/nav-header'
import { SiteFooter } from '../components/site-footer'
import { FilterSection, DEFAULT_RESULTS_COUNT } from '../components/filter-section'
import { SearchBar } from '../components/search-bar'
import CaseSearchResult from '../components/case-search-result'
import { SearchLoading, SearchProgress } from '../components/search-loading'
import { searchDocuments } from '../lib/research/search-client'
import type { CaseData } from '@/../types/caseData'
import { useSearchParams } from 'next/navigation'
// import WelcomeCard from '../components/welcome-card'
import { ShowcaseCarousel } from '../components/showcase-carousel'
import { useRouter } from 'next/navigation'
import { MobileAlert } from '../components/mobile-alert'

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
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [currentQuery, setCurrentQuery] = useState('')
  const [resultsCount, setResultsCount] = useState(DEFAULT_RESULTS_COUNT)
  const [searchProgress, setSearchProgress] = useState<SearchProgress>({
    queryStarted: false,
    upstashComplete: false,
    metadataStarted: false,
    metadataComplete: false,
    complete: false
  })

  // Fetch metadata for a single case
  const fetchCaseMetadata = async (caseId: string): Promise<CaseData> => {
    // Remove chunk number from ID (e.g., "1999_NZFC1-0" -> "1999_NZFC1")
    console.log('Fetching metadata for case ID:', caseId);
    const filename = caseId.split('-')[0];
    
    const response = await fetch('/api/case-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename
      })
    });

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
    
    // Reset progress
    setSearchProgress({
      queryStarted: false,
      upstashComplete: false,
      metadataStarted: false,
      metadataComplete: false,
      complete: false
    })
    
    try {
      // Start search
      setSearchProgress(prev => ({ ...prev, queryStarted: true }))
      
      // First do the actual search to get results
      console.log('Calling searchDocuments...');
      const searchResults = await searchDocuments(searchText.trim(), resultsCount) as RawSearchResult[];
      
      // Mark upstash complete
      setSearchProgress(prev => ({ ...prev, upstashComplete: true }))
      
      // Start metadata fetch
      setSearchProgress(prev => ({ ...prev, metadataStarted: true }))
      
      // Fetch metadata for each unique case
      const uniqueCaseIds = new Set(searchResults.map(result => result.id.split('-')[0]));
      const metadataPromises = Array.from(uniqueCaseIds).map(id => fetchCaseMetadata(id));
      
      // Wait for all metadata to be fetched
      const metadataResults = await Promise.allSettled(metadataPromises);
      
      // Mark metadata complete
      setSearchProgress(prev => ({ ...prev, metadataComplete: true }))
      
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
      
      // Mark complete
      setSearchProgress(prev => ({ ...prev, complete: true }))
    } catch (error) {
      console.error('Search error in page component:', error)
      setError(error instanceof Error ? error.message : 'Search failed')
      setResults([])
    } finally {
      // Don't set isSearching to false here - let the loading component handle it
      // after it's done showing the completion state
      setTimeout(() => {
        setIsSearching(false)
      }, 2500) // Wait for loading animation to complete
    }
  }

  const handleResultsCountChange = useCallback((count: number) => {
    // Update URL with new count
    const params = new URLSearchParams(searchParams.toString())
    params.set('count', count.toString())
    router.push(`/research?${params.toString()}`)
  }, [router, searchParams])

  const handleSearchComplete = useCallback((results: any) => {
    setResults(results)
    setIsSearching(false)
  }, [])

  const hasResults = results.length > 0 || isSearching;

  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader title="DONNA | RESEARCH" />
      <MobileAlert />
      <main className="flex-1 px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-8">
        <div className="w-full">
          <div className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 mt-4 sm:mt-6 md:mt-12">
            {/* <WelcomeCard /> */}
            <ShowcaseCarousel />
            <FilterSection onResultsCountChange={handleResultsCountChange} />
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {isSearching && (
            <div className="max-w-[1800px] mx-auto mt-8 sm:mt-12 md:mt-24 flex justify-center">
              <SearchLoading progress={searchProgress} />
            </div>
          )}
          
          {results.length > 0 && !isSearching && (
            <div className="max-w-[1600px] mx-auto mt-8 sm:mt-12 md:mt-24">
              <h2 className="text-sm sm:text-base font-medium text-gray-500 mb-3 sm:mb-4">
                Showing {results.length} Results
              </h2>
              <div className="space-y-3 sm:space-y-4 md:space-y-12">
                {results.map((result) => (
                  <CaseSearchResult
                    key={result.id}
                    caseData={result.metadata}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 mt-4 text-sm">{error}</div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

