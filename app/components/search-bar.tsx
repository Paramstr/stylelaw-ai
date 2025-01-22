'use client'

import { Button } from "@/components/ui/button"
import { Sparkles, HelpCircle, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [selectedMode, setSelectedMode] = useState("enabled")
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const modes = {
    enabled: {
      name: "Associate Overtime Mode",
      description: "Uses LLM based agents to intelligently search through cases, ranking based on relevance"
    },
    disabled: {
      name: "Hybrid Search",
      description: "Uses hybrid search with keywords and neural embeddings"
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    onSearch(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="border border-black">
        <div className="p-6 pb-12">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Donna about..."
            className="w-full text-lg font-serif text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none"
          />
        </div>
        
        <div className="flex items-center justify-between border-t border-black">
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-3 text-[#6B7280] hover:bg-transparent h-12 px-6 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Sparkles 
                    className={`w-4 h-4 transition-all duration-300 ${
                      selectedMode === "enabled" ? 'text-blue-500 filter drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]' : 'text-yellow-500 filter drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]'
                    }`} 
                  />
                  <span className="text-sm">
                    {selectedMode === "enabled" ? "Associate Overtime Mode" : "Hybrid Search"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[200px] bg-white border border-black rounded-none shadow-none p-0 mt-0.5 ml-4"
                align="start"
              >
                {selectedMode !== "enabled" && (
                  <DropdownMenuItem 
                    onClick={() => setSelectedMode("enabled")}
                    className="px-4 py-2 text-sm text-black hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-none cursor-pointer border-b border-black"
                  >
                    {modes.enabled.name}
                  </DropdownMenuItem>
                )}
                {selectedMode !== "disabled" && (
                  <DropdownMenuItem 
                    onClick={() => setSelectedMode("disabled")}
                    className="px-4 py-2 text-sm text-black hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-none cursor-pointer border-b border-black"
                  >
                    {modes.disabled.name}
                  </DropdownMenuItem>
                )}
                <div className="px-4 py-2 text-xs text-[#6B7280]">
                  {modes[selectedMode === "enabled" ? "disabled" : "enabled"].description}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-12 py-4 bg-black hover:bg-black/90 rounded-none font-serif text-xl h-full text-white disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
      
    </div>
  )
}

