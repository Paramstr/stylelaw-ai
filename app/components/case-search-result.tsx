"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Scale,
  AlertCircle,
  Check,
  XCircle,
  ArrowRight,
  Users,
  Gavel,
  BookOpen,
  FileText,
  History,
  Book,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CitationButton } from "./citation-button"
import { DetailsTab } from "./DetailsTab"
import { IssuesTab } from "./IssuesTab"
import { SignificanceTab } from "./SignificanceTab"
import { HistoryTab } from "./HistoryTab"
import { AuthoritiesTab } from "./AuthoritiesTab"
import type { CaseData } from "@/../types/caseData"

interface CaseSearchResultProps {
  caseData: CaseData
}

export default function CaseSearchResult({ caseData }: CaseSearchResultProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
  }, [])

  const {
    coreInfo,
    aiSummary,
    authorityStatus,
    participants,
    classification,
    strategy,
    practice,
    history,
    authorities,
  } = caseData

  return (
    <Card className="bg-white border border-black/10 rounded-none border-l-[3px] border-l-black">
      <motion.div initial={false} animate={isExpanded ? "expanded" : "collapsed"} className="divide-y divide-black/10">
        {/* Header Section */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.div className="text-sm font-mono">{coreInfo.citation}</motion.div>
                <Badge variant="outline" className="rounded-none border-0 bg-black text-white">
                  {coreInfo.status}
                </Badge>
              </div>
              <motion.h3 className="text-2xl font-light tracking-tight">{coreInfo.shortTitle}</motion.h3>
              <motion.p className="text-sm text-black/60 max-w-2xl leading-relaxed">{coreInfo.title}</motion.p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-black/60 mb-6">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span>{coreInfo.court}</span>
            </div>
            <span>{coreInfo.jurisdiction}</span>
            <span>{new Date(coreInfo.judgmentDate).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {classification.areasOfLaw.map((area: string) => (
              <Badge
                key={area}
                variant="secondary"
                className="rounded-none bg-black/5 text-black hover:bg-black/10 border-0"
              >
                {area}
              </Badge>
            ))}
            {classification.subAreas.map((area: string) => (
              <Badge
                key={area}
                variant="outline"
                className="rounded-none border-black/10 text-black/60 hover:bg-black/5"
              >
                {area}
              </Badge>
            ))}
          </div>

          <div className="bg-[#2F4F4F] p-6 rounded-sm mt-6 mb-6">
            <h4 className="text-sm font-medium mb-2 text-white">AI Summary</h4>
            <p className="text-sm text-white/95">{aiSummary}</p>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="border-t border-black/10">
                <div className="flex justify-center">
                  {["Details", "Issues", "Significance", "History", "Authorities"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab.toLowerCase() === tab.toLowerCase()
                          ? "text-black border-b-2 border-black"
                          : "text-black/60 hover:text-black hover:bg-black/5"
                      }`}
                      onClick={() => handleTabChange(tab.toLowerCase())}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "details" && (
                    <DetailsTab
                      classification={classification}
                      authorityStatus={authorityStatus}
                      participants={participants}
                      strategy={strategy}
                    />
                  )}

                  {activeTab === "issues" && <IssuesTab strategy={strategy} />}

                  {activeTab === "significance" && <SignificanceTab practice={practice} />}

                  {activeTab === "history" && <HistoryTab history={history} />}

                  {activeTab === "authorities" && <AuthoritiesTab authorities={authorities} />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className="py-1 px-4 flex justify-center items-center cursor-pointer hover:bg-black/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col items-center">
            <ChevronDown
              className={`w-4 h-4 text-black/40 transition-transform ${isExpanded ? "transform rotate-180" : ""}`}
            />
            <span className="text-[10px] text-black/40">{isExpanded ? "Collapse" : "Expand for more details"}</span>
          </div>
        </div>
      </motion.div>
    </Card>
  )
}

