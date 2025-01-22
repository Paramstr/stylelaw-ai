'use client'

import { useState } from 'react'
import { NavHeader } from '../components/nav-header'
import { SiteFooter } from '../components/site-footer'
import { FilterSection } from '../components/filter-section'
import { SearchBar } from '../components/search-bar'
import { SearchResults } from '../components/search-results'
import { searchDocuments } from '../lib/research/search-client'

interface SearchResult {
  id: string
  score: number
  metadata: {
    content: string
    filename: string
    chunkIndex: number
  }
}

export default function ResearchPage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [currentQuery, setCurrentQuery] = useState('')
  const [resultsCount, setResultsCount] = useState(10)

  const handleSearch = async (searchText: string) => {
    if (!searchText.trim()) return
    
    setIsSearching(true)
    setError('')
    setResults([])
    setCurrentQuery(searchText.trim())
    
    try {
      const searchResults = await searchDocuments(searchText.trim(), resultsCount)
      setResults(searchResults as SearchResult[])
    } catch (error) {
      console.error('Search error:', error)
      setError(error instanceof Error ? error.message : 'Search failed')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultsCountChange = (count: number) => {
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
                <FilterSection 
                  onResultsCountChange={handleResultsCountChange}
                />
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
            <div className="mt-8">
              <SearchResults 
                results={results} 
                isLoading={isSearching} 
                searchQuery={currentQuery} 
              />
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

