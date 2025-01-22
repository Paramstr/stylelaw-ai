import { Panel, PanelHeader, PanelSection } from './ui/Panel'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

interface Theme {
  theme_name: string
  strength: number
}

interface Relevance {
  score: number
  reason: string
}

interface SearchResult {
  id: string
  score: number
  metadata: {
    content: string
    filename: string
    chunkIndex: number
  }
  themes?: Theme[]
  relevance?: Relevance
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

function ThemeStrength({ strength }: { strength: number }) {
  // Calculate color based on strength - using shades of green
  const getColor = (strength: number) => {
    if (strength >= 4.5) return 'bg-green-900'
    if (strength >= 4) return 'bg-green-800'
    if (strength >= 3) return 'bg-green-700'
    if (strength >= 2) return 'bg-green-600'
    return 'bg-green-500'
  }

  return (
    <div className={cn(
      "w-10 h-6 flex items-center justify-center text-[11px] font-medium text-white mr-4",
      getColor(strength)
    )}>
      {strength.toFixed(1)}
    </div>
  )
}

function RelevanceScore({ score, reason }: Relevance) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-2xl font-medium">{score}%</div>
      <div className="text-sm text-gray-600">{reason}</div>
    </div>
  )
}

export function SearchResults({ results, isLoading, searchQuery = '' }: SearchResultsProps) {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [resultsWithThemes, setResultsWithThemes] = useState<SearchResult[]>([]);
  const [loadingThemes, setLoadingThemes] = useState<Set<string>>(new Set());

  // Start theme analysis as soon as we get new results
  useEffect(() => {
    setResultsWithThemes(results);
    
    // Analyze themes for all new results
    const analyzeThemes = async () => {
      const newResults = results.filter(r => !r.themes);
      
      // Start all theme analyses in parallel
      const analysisPromises = newResults.map(async (result) => {
        setLoadingThemes(prev => new Set(prev).add(result.id));
        
        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: result.metadata.content })
          });
          
          if (!response.ok) throw new Error('Failed to analyze themes');
          
          const { themes, relevance } = await response.json();
          
          setResultsWithThemes(prev => 
            prev.map(r => 
              r.id === result.id ? { ...r, themes, relevance } : r
            )
          );
        } catch (error) {
          console.error(`Failed to fetch themes for result ${result.id}:`, error);
        } finally {
          setLoadingThemes(prev => {
            const newSet = new Set(prev);
            newSet.delete(result.id);
            return newSet;
          });
        }
      });
      
      // Wait for all analyses to complete
      await Promise.all(analysisPromises);
    };

    if (results.length > 0) {
      analyzeThemes();
    }
  }, [results]);

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
            <div key={i} className="bg-gray-100 h-48 border border-black" />
          ))}
        </div>
      </div>
    )
  }

  if (!resultsWithThemes?.length) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="text-base font-medium text-gray-900 pb-2">Search Results</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="text-base font-medium text-gray-900 pb-2 mb-1">Search Results</div>
      <div className="space-y-4">
        {resultsWithThemes.map((result) => {
          const isExpanded = expandedResults.has(result.id);
          const highlightedContent = highlightText(result.metadata.content, searchQuery);
          const isLoadingThemes = loadingThemes.has(result.id);

          return (
            <div key={result.id} className="border border-black bg-white">
              <div className="border-b border-black">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <span className="font-medium font-serif">{result.metadata.filename}</span>
                    <Badge className="text-xs border border-black bg-white text-black font-medium">
                      Chunk {result.metadata.chunkIndex + 1}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] border-b border-black">
                <div className="px-4 py-3 border-r border-black">
                  {isLoadingThemes ? (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="h-4 bg-gray-100 w-48" />
                          <div className="h-6 w-10 bg-gray-100" />
                        </div>
                      ))}
                    </div>
                  ) : result.themes ? (
                    <div className="space-y-2">
                      {result.themes.map((theme, index) => (
                        <div key={index} className="flex items-center">
                          <ThemeStrength strength={theme.strength} />
                          <span className="text-sm font-medium min-w-[200px]">{theme.theme_name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No themes analyzed yet</div>
                  )}
                </div>
                <div className="w-64 px-4 py-3 bg-gray-50">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Relevance</div>
                  {result.relevance ? (
                    <RelevanceScore {...result.relevance} />
                  ) : (
                    <div className="text-sm text-gray-500">Analyzing...</div>
                  )}
                </div>
              </div>

              <div className="px-4 py-3">
                <div 
                  className={cn("text-sm text-gray-700", !isExpanded && "line-clamp-2")}
                  dangerouslySetInnerHTML={{ __html: highlightedContent }} 
                />
                <button
                  onClick={() => toggleExpand(result.id)}
                  className="text-sm text-gray-500 hover:text-black mt-2 flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      Show less
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show more
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 