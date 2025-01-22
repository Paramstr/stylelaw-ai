import { Panel, PanelHeader, PanelSection } from './ui/Panel'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from './ui/badge'

interface SearchResult {
  id: string
  score: number
  metadata: {
    content: string
    filename: string
    chunkIndex: number
  }
}

interface SearchResultsProps {
  results: SearchResult[]
  isLoading?: boolean
  searchQuery?: string
}

function highlightText(text: string, query: string) {
  if (!query) return text;
  
  const words = query.toLowerCase().split(' ').filter(word => word.length > 2);
  let highlightedText = text;

  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-100 px-0.5 rounded">$1</mark>');
  });

  return highlightedText;
}

export function SearchResults({ results, isLoading, searchQuery = '' }: SearchResultsProps) {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedResults(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-48 rounded-sm" />
          ))}
        </div>
      </div>
    )
  }

  if (!results?.length) {
    return null
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-4">
      {results.map((result) => {
        const isExpanded = expandedResults.has(result.id);
        const highlightedContent = highlightText(result.metadata.content, searchQuery);

        return (
          <Panel key={result.id} className="w-full transition-all duration-200 hover:shadow-md">
            <PanelHeader className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(result.id)}>
              <div className="flex items-center gap-4">
                <span className="font-medium">{result.metadata.filename}</span>
                <Badge variant="secondary" className="text-xs">
                  Chunk {result.metadata.chunkIndex + 1}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Score: {(result.score * 100).toFixed(1)}%
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </PanelHeader>
            <PanelSection>
              <div className={`text-sm text-gray-700 ${isExpanded ? '' : 'line-clamp-3'}`}>
                <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
              </div>
              {!isExpanded && result.metadata.content.length > 200 && (
                <button
                  onClick={() => toggleExpand(result.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  Show more
                </button>
              )}
            </PanelSection>
          </Panel>
        )
      })}
    </div>
  )
} 