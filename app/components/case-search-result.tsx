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
  FileText as FileIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CitationButton } from "./citation-button"
import { DetailsTab } from "./search-result-tabs/DetailsTab"
import { IssuesTab } from "./search-result-tabs/IssuesTab"
import { SignificanceTab } from "./search-result-tabs/SignificanceTab"
import { HistoryTab } from "./search-result-tabs/HistoryTab"
import { AuthoritiesTab } from "./search-result-tabs/AuthoritiesTab"
import type { CaseData } from "@/../types/caseData"
import PDFViewer from "./pdf-viewer"

interface CaseSearchResultProps {
  caseData: CaseData
}

const CaseSearchResult = ({ caseData }: CaseSearchResultProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null)

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
  }, [])

  const handleParagraphClick = useCallback((paragraph: number) => {
    console.log('CaseSearchResult: Paragraph clicked:', paragraph, 'Current tab:', activeTab);
    // Only update if the paragraph is different or if selectedParagraph is null
    if (paragraph !== selectedParagraph) {
      setSelectedParagraph(paragraph);
    } else {
      // Force a re-search by briefly setting to null and back
      setSelectedParagraph(null);
      requestAnimationFrame(() => {
        setSelectedParagraph(paragraph);
      });
    }
  }, [activeTab, selectedParagraph])

  // Early return if required data is missing
  if (!caseData?.coreInfo?.citation || !caseData?.classification) {
    return null
  }

  return (
    <Card className="bg-white border border-black rounded-none w-full">
      <div className="divide-black">
        {/* Header Section */}
        <div className="p-4 md:p-8 relative grid grid-cols-1 md:grid-cols-[1fr,800px] gap-4 md:gap-6">
          {/* Left Column - Details */}
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <motion.div className="text-sm font-mono break-all">{caseData.coreInfo.citation}</motion.div>
                {caseData.pdfFile && (
                  <span className="text-sm font-mono text-black/40 break-all">{caseData.pdfFile}</span>
                )}
              </div>
              {caseData.coreInfo.title && (
                <motion.h3 className="text-xl md:text-2xl font-serif tracking-tight">{caseData.coreInfo.title}</motion.h3>
              )}
              {caseData.coreInfo.status && (
                <Badge variant="outline" className="rounded-none border-0 bg-black text-white">
                  {caseData.coreInfo.status}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm font-serif text-black/60">
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
          </div>

          {/* Right Column - Controls & Summary */}
          <div className="flex flex-col items-end gap-8">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`group p-2  flex items-center gap-0 hover:gap-2 transition-all duration-200 ${
                isExpanded 
                  ? "bg-white border border-black hover:bg-black/5" 
                  : "bg-black hover:bg-black/90"
              }`}
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  isExpanded ? "text-black" : "text-white"
                } ${isExpanded ? "transform rotate-180" : ""}`}
              />
              <span className={`text-sm overflow-hidden w-0 group-hover:w-[4.2rem] whitespace-nowrap transition-all duration-200 ${
                isExpanded ? "text-black" : "text-white"
              }`}>
                {isExpanded ? "Close" : "Expand"}
              </span>
            </button>
            {caseData.aiSummary && (
              <div className="bg-[#2F4F4F] p-4 md:p-6 w-full">
                <h4 className="text-base font-medium mb-2 md:mb-3 text-white uppercase tracking-wide">AI Summary</h4>
                <p className="text-sm text-white/95">{caseData.aiSummary}</p>
              </div>
            )}
          </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-4 md:gap-6">
                  {/* Left Column - Tabs and Content */}
                  <div className="min-h-[400px] md:min-h-[800px]">
                    <div className="flex flex-wrap justify-start md:justify-center">
                      {[
                        { name: "Details", icon: FileText },
                        { name: "Issues", icon: AlertCircle },
                        { name: "Significance", icon: Scale },
                        { name: "History", icon: History },
                        { name: "Authorities", icon: Book }
                      ].map(({ name, icon: Icon }) => (
                        <button
                          key={name}
                          className={`px-3 md:px-6 py-2 md:py-3 text-[14px] md:text-[15px] font-medium transition-all flex items-center gap-2 ${
                            activeTab.toLowerCase() === name.toLowerCase()
                              ? "text-black border-b-2 border-black"
                              : "text-black/60 hover:text-black"
                          }`}
                          onClick={() => handleTabChange(name.toLowerCase())}
                        >
                          <Icon className="w-4 h-4" />
                          {name}
                        </button>
                      ))}
                    </div>

                    <div className="h-[calc(100%-3rem)] overflow-y-auto">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="h-full"
                        >
                          {activeTab === "details" && (
                            <DetailsTab
                              classification={caseData.classification}
                              authorityStatus={caseData.authorityStatus}
                              participants={caseData.participants}
                              strategy={caseData.strategy}
                              onParagraphClick={handleParagraphClick}
                            />
                          )}

                          {activeTab === "issues" && (
                            <IssuesTab 
                              strategy={caseData.strategy} 
                              onParagraphClick={handleParagraphClick}
                            />
                          )}

                          {activeTab === "significance" && (
                            <SignificanceTab 
                              practice={caseData.practice}
                              onParagraphClick={handleParagraphClick} 
                            />
                          )}

                          {activeTab === "history" && (
                            <HistoryTab 
                              history={caseData.history}
                              onParagraphClick={handleParagraphClick}
                            />
                          )}

                          {activeTab === "authorities" && (
                            <AuthoritiesTab 
                              authorities={caseData.authorities}
                              onParagraphClick={handleParagraphClick}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Column - PDF Viewer */}
                  <div className="min-h-[400px] md:min-h-[800px]">
                    <div className="h-full">
                      <div className="h-full">
                        <div className="h-[calc(100%-3rem)] p-4 md:p-8">
                          <PDFViewer 
                            fileUrl={`/api/pdf/${caseData.pdfFile}`}
                            base64Data={caseData.pdfBase64}
                            searchQuery={selectedParagraph?.toString()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}

export default CaseSearchResult