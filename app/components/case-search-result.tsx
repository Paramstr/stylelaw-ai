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

const CaseSearchResult = ({ caseData }: CaseSearchResultProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
  }, [])

  // Early return if required data is missing
  if (!caseData?.coreInfo?.citation || !caseData?.classification) {
    return null
  }

  return (
    <Card className="bg-white border border-black rounded-none">
      <div className="divide-y divide-black">
        {/* Header Section */}
        <div className="p-8 relative">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.div className="text-sm font-mono">{caseData.coreInfo.citation}</motion.div>
                {caseData.coreInfo.status && (
                  <Badge variant="outline" className="rounded-none border-0 bg-black text-white">
                    {caseData.coreInfo.status}
                  </Badge>
                )}
              </div>
              {caseData.coreInfo.shortTitle && (
                <motion.h3 className="text-2xl font-serif tracking-tight">{caseData.coreInfo.shortTitle}</motion.h3>
              )}
              {caseData.coreInfo.title && (
                <motion.p className="text-sm font-serif text-black/60 max-w-2xl leading-relaxed">
                  {caseData.coreInfo.title}
                </motion.p>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group p-2 bg-black hover:bg-black/80 transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 text-white transition-transform duration-200 ${
                  isExpanded ? "transform rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-serif text-black/60 mb-6">
            {caseData.coreInfo.court && (
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                <span>{caseData.coreInfo.court}</span>
              </div>
            )}
            {caseData.coreInfo.jurisdiction && <span>{caseData.coreInfo.jurisdiction}</span>}
            {caseData.coreInfo.judgmentDate && (
              <span>{new Date(caseData.coreInfo.judgmentDate).toLocaleDateString()}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {(caseData.classification.areasOfLaw || []).map((area: string) => (
              <Badge
                key={area}
                variant="secondary"
                className="rounded-none bg-black/5 text-black hover:bg-black/10 border-0"
              >
                {area}
              </Badge>
            ))}
            {(caseData.classification.subAreas || []).map((area: string) => (
              <Badge
                key={area}
                variant="outline"
                className="rounded-none border-black/10 text-black/60 hover:bg-black/5"
              >
                {area}
              </Badge>
            ))}
          </div>

          {caseData.aiSummary && (
            <div className="bg-[#2F4F4F] p-6 rounded-sm mt-6 mb-6">
              <h4 className="text-sm font-medium mb-2 text-white">AI Summary</h4>
              <p className="text-sm text-white/95">{caseData.aiSummary}</p>
            </div>
          )}
        </div>

        <div className="relative">
          <AnimatePresence initial={false} mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  height: {
                    duration: 0.2,
                    ease: "easeInOut"
                  },
                  opacity: { duration: 0.15 }
                }}
                className="overflow-hidden"
              >
                <div className="border-t border-black">
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
                        classification={caseData.classification}
                        authorityStatus={caseData.authorityStatus}
                        participants={caseData.participants}
                        strategy={caseData.strategy}
                      />
                    )}

                    {activeTab === "issues" && <IssuesTab strategy={caseData.strategy} />}

                    {activeTab === "significance" && <SignificanceTab practice={caseData.practice} />}

                    {activeTab === "history" && <HistoryTab history={caseData.history} />}

                    {activeTab === "authorities" && <AuthoritiesTab authorities={caseData.authorities} />}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}

export default CaseSearchResult

