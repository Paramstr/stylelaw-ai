'use client'

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Clock, Globe, Building2, FileText, Scale } from 'lucide-react'

interface FilterSectionProps {
  className?: string
}

export function FilterSection({ className }: FilterSectionProps) {
  return (
    <div className={cn("space-y-8 p-6", className)}>
      <div className="space-y-4">
        <h2 className="text-lg font-serif text-black">Publish Date</h2>
        <div className="space-y-2 text-[#6B7280]">
          <button className="flex items-center gap-2 text-black font-semibold">
            <Clock className="w-3 h-3" />
            <span>Any time</span>
          </button>
          
          <button className="flex items-center gap-2 hover:text-black">
            <Clock className="w-3 h-3" />
            <span>Past day</span>
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <Clock className="w-3 h-3" />
            <span>Past week</span>
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <Clock className="w-3 h-3" />
            <span>Past month</span>
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <Clock className="w-3 h-3" />
            <span>Past year</span>
          </button>
          
          <div className="flex items-center gap-2 pt-2">
            <CalendarIcon className="w-3 h-3" />
            <span>After</span>
            <input type="text" placeholder="MM/DD/YYYY" className="w-28 text-xs border-b border-gray-300 focus:outline-none focus:border-black" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-serif text-black">Category</h2>
        <div className="space-y-2 text-[#6B7280]">
          <button className="flex items-center gap-2 text-black font-semibold">
            <Globe className="w-3 h-3" />
            <span>New Zealand</span>
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <FileText className="w-3 h-3" />
            <span>Family Law</span>
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <Scale className="w-3 h-3" />
            <span>Court of Appeal</span>
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <Building2 className="w-3 h-3" />
            <span>District Court</span>
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <Building2 className="w-3 h-3" />
            <span>High Court</span>
          </button>
          <button className="flex items-center gap-2 hover:text-black">
            <Building2 className="w-3 h-3" />
            <span>Supreme Court</span>
          </button>
        </div>
        <button className="text-[#6B7280] text-xs hover:text-black">
          Show more
        </button>
      </div>
    </div>
  )
}

