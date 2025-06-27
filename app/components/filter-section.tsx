'use client'

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "../lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Clock, Globe, Building2, FileText, Scale, ChevronDown, MapPin } from 'lucide-react'
import { useState, useRef, useCallback } from "react"
import { useOnClickOutside } from 'usehooks-ts'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterSectionProps {
  className?: string
  onResultsCountChange?: (count: number) => void
}

type TimeRange = 'any' | 'day' | 'week' | 'month' | 'year';
type Category = 'family-law' | 'court-of-appeal' | 'district-court' | 'high-court' | 'supreme-court';
type Region = 'new-zealand' | 'australia' | 'uk' | 'canada';

export const RESULTS_COUNT_VALUES = [1, 3, 5, 10] as const;
export const DEFAULT_RESULTS_COUNT = 3;
export type ResultsCount = typeof RESULTS_COUNT_VALUES[number];

export function FilterSection({ className, onResultsCountChange }: FilterSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentCount = parseInt(searchParams.get('count') ?? DEFAULT_RESULTS_COUNT.toString(), 10)
  const currentQuery = searchParams.get('q') || ''
  
  const [timeRange, setTimeRange] = useState<TimeRange>('any')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['family-law'])
  const [selectedRegion, setSelectedRegion] = useState<Region>('new-zealand')
  const [resultsCount, setResultsCount] = useState<ResultsCount>(DEFAULT_RESULTS_COUNT)
  const [timeOpen, setTimeOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [countOpen, setCountOpen] = useState(false)
  
  const timeRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(timeRef, () => {
    setTimeOpen(false)
  })

  useOnClickOutside(regionRef, () => {
    setRegionOpen(false)
  })

  useOnClickOutside(categoryRef, () => {
    setCategoryOpen(false)
  })

  useOnClickOutside(countRef, () => {
    setCountOpen(false)
  })

  const timeRangeLabels: Record<TimeRange, string> = {
    'any': 'Any time',
    'day': 'Past day',
    'week': 'Past week',
    'month': 'Past month',
    'year': 'Past year'
  }

  const regionLabels: Record<Region, string> = {
    'new-zealand': 'New Zealand',
    'australia': 'Australia',
    'uk': 'United Kingdom',
    'canada': 'Canada'
  }

  const handleTimeRangeSelect = useCallback((range: TimeRange) => {
    setTimeRange(range)
    setTimeOpen(false)
  }, [])

  const handleCategoryToggle = useCallback((category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
    setCategoryOpen(false)
  }, [])

  const handleRegionSelect = useCallback((region: Region) => {
    setSelectedRegion(region)
    setRegionOpen(false)
  }, [])

  const handleResultsCountChange = useCallback((count: ResultsCount) => {
    setResultsCount(count)
    onResultsCountChange?.(count)
    setCountOpen(false)
  }, [onResultsCountChange])

  const removeFilter = useCallback((type: 'category' | 'time' | 'region', value?: Category) => {
    if (type === 'category' && value) {
      setSelectedCategories(prev => prev.filter(c => c !== value))
    } else if (type === 'time') {
      setTimeRange('any')
    } else if (type === 'region') {
      setSelectedRegion('new-zealand')
    }
  }, [])

  const handleTimeOpenChange = useCallback((open: boolean) => {
    setTimeOpen(open)
  }, [])

  const handleRegionOpenChange = useCallback((open: boolean) => {
    setRegionOpen(open)
  }, [])

  const handleCategoryOpenChange = useCallback((open: boolean) => {
    setCategoryOpen(open)
  }, [])

  const handleCountOpenChange = useCallback((open: boolean) => {
    setCountOpen(open)
  }, [])

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <div className="max-w-4xl w-full flex flex-wrap gap-2 sm:gap-3 items-center">
        {/* Time Range Filter */}
        <Collapsible className="w-fit" open={timeOpen} onOpenChange={handleTimeOpenChange}>
          <div ref={timeRef}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 rounded-none border border-black hover:bg-black hover:text-white transition-colors text-xs sm:text-sm"
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{timeRangeLabels[timeRange]}</span>
                <span className="xs:hidden">Time</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-50 mt-1 bg-white border border-black min-w-[160px] sm:min-w-[180px]">
              <div className="grid grid-cols-1 divide-y divide-black">
                {Object.entries(timeRangeLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start rounded-none h-8 sm:h-9 text-xs sm:text-sm",
                      timeRange === key ? "bg-black text-white" : "hover:bg-black hover:text-white"
                    )}
                    onClick={() => handleTimeRangeSelect(key as TimeRange)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Region Filter */}
        <Collapsible className="w-fit" open={regionOpen} onOpenChange={handleRegionOpenChange}>
          <div ref={regionRef}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 rounded-none border border-black hover:bg-black hover:text-white transition-colors text-xs sm:text-sm"
              >
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{regionLabels[selectedRegion]}</span>
                <span className="xs:hidden">Region</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-50 mt-1 bg-white border border-black min-w-[160px] sm:min-w-[180px]">
              <div className="grid grid-cols-1 divide-y divide-black">
                {Object.entries(regionLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start rounded-none h-8 sm:h-9 text-xs sm:text-sm",
                      selectedRegion === key ? "bg-black text-white" : "hover:bg-black hover:text-white"
                    )}
                    onClick={() => handleRegionSelect(key as Region)}
                  >
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Category Filter */}
        <Collapsible className="w-fit" open={categoryOpen} onOpenChange={handleCategoryOpenChange}>
          <div ref={categoryRef}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 rounded-none border border-black hover:bg-black hover:text-white transition-colors text-xs sm:text-sm">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" fill="none" />
                Categories
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-50 mt-1 bg-white border border-black min-w-[160px] sm:min-w-[180px]">
              <div className="grid grid-cols-1 divide-y divide-black">
                {/* Category buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-8 sm:h-9 text-xs sm:text-sm",
                    selectedCategories.includes('family-law') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('family-law')}
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Family Law
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-8 sm:h-9 text-xs sm:text-sm",
                    selectedCategories.includes('court-of-appeal') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('court-of-appeal')}
                >
                  <Scale className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Court of Appeal
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-8 sm:h-9 text-xs sm:text-sm",
                    selectedCategories.includes('district-court') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('district-court')}
                >
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  District Court
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-8 sm:h-9 text-xs sm:text-sm",
                    selectedCategories.includes('high-court') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('high-court')}
                >
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  High Court
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-8 sm:h-9 text-xs sm:text-sm",
                    selectedCategories.includes('supreme-court') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('supreme-court')}
                >
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Supreme Court
                </Button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Results Count Filter */}
        <Collapsible className="w-fit" open={countOpen} onOpenChange={handleCountOpenChange}>
          <div ref={countRef}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 rounded-none border border-black hover:bg-black hover:text-white transition-colors text-xs sm:text-sm"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" fill="none" />
                <span className="hidden xs:inline">{resultsCount} Results</span>
                <span className="xs:hidden">{resultsCount}</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-50 mt-1 bg-white border border-black min-w-[160px] sm:min-w-[180px]">
              <div className="grid grid-cols-1 divide-y divide-black">
                {RESULTS_COUNT_VALUES.map((count) => (
                  <Button
                    key={count}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start rounded-none h-8 sm:h-9 text-xs sm:text-sm",
                      resultsCount === count ? "bg-black text-white" : "hover:bg-black hover:text-white"
                    )}
                    onClick={() => handleResultsCountChange(count)}
                  >
                    {count} Results
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Active Filters */}
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {selectedCategories.map(category => (
            <div 
              key={category}
              className="flex items-center border border-black px-1 sm:px-2 h-8 sm:h-9 gap-1 sm:gap-2 bg-black text-white"
            >
              <span className="text-xs sm:text-sm">
                {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
              <button 
                className="hover:text-red-600 text-xs sm:text-sm"
                onClick={() => removeFilter('category', category)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

