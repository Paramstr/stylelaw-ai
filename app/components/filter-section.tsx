'use client'

import { Button } from "@/components/ui/Button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Clock, Globe, Building2, FileText, Scale, ChevronDown, MapPin } from 'lucide-react'
import { useState, useRef } from "react"
import { useOnClickOutside } from 'usehooks-ts'

interface FilterSectionProps {
  className?: string
}

type TimeRange = 'any' | 'day' | 'week' | 'month' | 'year' | 'custom';
type Category = 'family-law' | 'court-of-appeal' | 'district-court' | 'high-court' | 'supreme-court';
type Region = 'new-zealand' | 'australia' | 'uk' | 'canada';

export function FilterSection({ className }: FilterSectionProps) {
  const [date, setDate] = useState<Date>()
  const [timeRange, setTimeRange] = useState<TimeRange>('any')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [selectedRegion, setSelectedRegion] = useState<Region>('new-zealand')
  const [timeOpen, setTimeOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  
  const timeRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(timeRef, () => {
    setTimeOpen(false)
  })

  useOnClickOutside(regionRef, () => {
    setRegionOpen(false)
  })

  useOnClickOutside(categoryRef, () => {
    setCategoryOpen(false)
  })

  const timeRangeLabels: Record<TimeRange, string> = {
    'any': 'Any time',
    'day': 'Past day',
    'week': 'Past week',
    'month': 'Past month',
    'year': 'Past year',
    'custom': 'Custom date'
  }

  const regionLabels: Record<Region, string> = {
    'new-zealand': 'New Zealand',
    'australia': 'Australia',
    'uk': 'United Kingdom',
    'canada': 'Canada'
  }

  const handleTimeRangeSelect = (range: TimeRange) => {
    setTimeRange(range)
    if (range !== 'custom') {
      setDate(undefined)
    }
  }

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
  }

  const removeFilter = (type: 'category' | 'time' | 'region', value?: Category) => {
    if (type === 'category' && value) {
      setSelectedCategories(prev => prev.filter(c => c !== value))
    } else if (type === 'time') {
      setTimeRange('any')
      setDate(undefined)
    } else if (type === 'region') {
      setSelectedRegion('new-zealand')
    }
  }

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <div className="max-w-4xl w-full flex flex-wrap gap-3 items-center">
        {/* Time Range Filter */}
        <Collapsible className="w-fit" open={timeOpen} onOpenChange={setTimeOpen}>
          <div ref={timeRef}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 h-9 px-3 rounded-none border border-black hover:bg-black hover:text-white transition-colors"
              >
                <Clock className="h-4 w-4" />
                {timeRange === 'custom' && date ? format(date, "PPP") : timeRangeLabels[timeRange]}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-50 mt-1 bg-white border border-black min-w-[180px]">
              <div className="grid grid-cols-1 divide-y divide-black">
                {Object.entries(timeRangeLabels).map(([key, label]) => (
                  key !== 'custom' && (
                    <Button
                      key={key}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start rounded-none h-9",
                        timeRange === key ? "bg-black text-white" : "hover:bg-black hover:text-white"
                      )}
                      onClick={() => handleTimeRangeSelect(key as TimeRange)}
                    >
                      {label}
                    </Button>
                  )
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "w-full justify-start rounded-none h-9",
                        timeRange === 'custom' ? "bg-black text-white" : "hover:bg-black hover:text-white"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 rounded-none border border-black">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-none border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Region Filter */}
        <Collapsible className="w-fit" open={regionOpen} onOpenChange={setRegionOpen}>
          <div ref={regionRef}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 h-9 px-3 rounded-none border border-black hover:bg-black hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4" />
                {regionLabels[selectedRegion]}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-50 mt-1 bg-white border border-black min-w-[180px]">
              <div className="grid grid-cols-1 divide-y divide-black">
                {Object.entries(regionLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start rounded-none h-9",
                      selectedRegion === key ? "bg-black text-white" : "hover:bg-black hover:text-white"
                    )}
                    onClick={() => handleRegionSelect(key as Region)}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Category Filter */}
        <Collapsible className="w-fit" open={categoryOpen} onOpenChange={setCategoryOpen}>
          <div ref={categoryRef}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-9 px-3 rounded-none border border-black hover:bg-black hover:text-white transition-colors">
                <FileText className="h-4 w-4" fill="none" />
                Categories
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute z-50 mt-1 bg-white border border-black min-w-[180px]">
              <div className="grid grid-cols-1 divide-y divide-black">
                {/* Category buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-9",
                    selectedCategories.includes('family-law') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('family-law')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Family Law
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-9",
                    selectedCategories.includes('court-of-appeal') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('court-of-appeal')}
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Court of Appeal
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-9",
                    selectedCategories.includes('district-court') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('district-court')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  District Court
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-9",
                    selectedCategories.includes('high-court') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('high-court')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  High Court
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start rounded-none h-9",
                    selectedCategories.includes('supreme-court') ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleCategoryToggle('supreme-court')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Supreme Court
                </Button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Active Filters */}
        <div className="flex gap-2 flex-wrap">
          {selectedCategories.map(category => (
            <div 
              key={category}
              className="flex items-center border border-black px-2 h-9 gap-2 bg-black text-white"
            >
              <span className="text-sm">
                {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
              <button 
                className="hover:text-red-600"
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

