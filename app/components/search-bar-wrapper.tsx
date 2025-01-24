'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SearchBar } from './search-bar'

interface SearchBarWrapperProps {
  defaultQuery?: string
}

export function SearchBarWrapper({ defaultQuery = '' }: SearchBarWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleSearch = (query: string) => {
    // Get current count from URL or use default
    const count = searchParams.get('count') || '10'
    
    // Create new URL with updated search params
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    params.set('count', count)
    
    // Navigate to new URL
    router.push(`/research?${params.toString()}`)
  }
  
  return (
    <SearchBar 
      defaultValue={defaultQuery} 
      onSearch={handleSearch}
    />
  )
} 