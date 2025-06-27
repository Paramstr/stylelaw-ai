'use client'

import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { Sparkles, HelpCircle, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useCallback } from 'react'
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (query: string) => void
  defaultValue?: string
}

export function SearchBar({ onSearch, defaultValue = '' }: SearchBarProps) {
  const [selectedMode, setSelectedMode] = useState("disabled")
  const [query, setQuery] = useState(defaultValue)
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleModeChange = useCallback((mode: string) => {
    setSelectedMode(mode);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="border border-black relative z-0">
        <div className="p-3 sm:p-6 pb-8 sm:pb-12">
          <input 
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search for ..."
            className="w-full text-base sm:text-lg font-serif text-black placeholder:text-[#6B7280] focus:outline-none"
          />
        </div>
        
        <div className="flex items-center justify-between border-t border-black">
          <div className="flex items-center gap-2 sm:gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={'ghost' as const}
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 text-[#6B7280] hover:bg-transparent h-10 sm:h-12 px-3 sm:px-6 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  )}
                >
                  <Sparkles 
                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                      selectedMode === "enabled" ? 'text-yellow-500 filter drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]' : 'text-green-600 filter drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]'
                    }`} 
                  />
                  <span className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">
                      {selectedMode === "enabled" ? "Associate Overtime Mode" : "Hybrid Search"}
                    </span>
                    <span className="sm:hidden">
                      {selectedMode === "enabled" ? "Associate" : "Hybrid"}
                    </span>
                  </span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[160px] sm:w-[200px] bg-white border border-black rounded-none shadow-none p-0 mt-0.5 ml-4"
                align="start"
              >
                {selectedMode !== "enabled" && (
                  <DropdownMenuItem 
                    onClick={() => handleModeChange("enabled")}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-black hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-none cursor-pointer border-b border-black"
                  >
                    <span className="hidden sm:inline">{modes.enabled.name}</span>
                    <span className="sm:hidden">Associate Mode</span>
                  </DropdownMenuItem>
                )}
                {selectedMode !== "disabled" && (
                  <DropdownMenuItem 
                    onClick={() => handleModeChange("disabled")}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-black hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-none cursor-pointer border-b border-black"
                  >
                    <span className="hidden sm:inline">{modes.disabled.name}</span>
                    <span className="sm:hidden">Hybrid Search</span>
                  </DropdownMenuItem>
                )}
                <div className="px-3 sm:px-4 py-2 text-xs text-[#6B7280]">
                  {modes[selectedMode === "enabled" ? "disabled" : "enabled"].description}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 sm:px-12 py-2 sm:py-4 bg-black hover:bg-black/90 rounded-none font-serif text-base sm:text-xl h-full text-white disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
      
    </div>
  )
}