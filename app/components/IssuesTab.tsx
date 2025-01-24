import { BookOpen, Check, XCircle, ArrowRight, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { CitationButton } from "./citation-button"
import type { CaseData } from "@/../types/caseData"

interface IssuesTabProps {
  strategy: CaseData["strategy"]
  onParagraphClick?: (paragraph: number) => void
}

export function IssuesTab({ strategy, onParagraphClick }: IssuesTabProps) {
  if (!strategy?.keyIssues?.length) {
    return (
      <div className="p-8">
        <h4 className="text-lg font-light mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Key Issues
        </h4>
        <div className="text-sm text-black/60">No issues data available.</div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h4 className="text-lg font-light mb-6 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Key Issues
      </h4>
      <div className="space-y-6">
        {strategy.keyIssues.map((issue, index) => {
          if (!issue) return null;
          
          return (
            <div key={index} className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
              <h5 className="text-sm font-medium mb-4 flex items-center gap-2">
                <span className="flex-1">{issue.issue}</span>
                {issue.paragraphs?.issue && <CitationButton paragraphs={issue.paragraphs.issue} onParagraphClick={onParagraphClick} />}
              </h5>
              <div className="space-y-4">
                {issue.resolution && (
                  <div className="flex items-start gap-3">
                    {issue.resolution.toLowerCase().includes("no breach") ? (
                      <XCircle className="w-5 h-5 text-black/40 mt-0.5 shrink-0" />
                    ) : (
                      <Check className="w-5 h-5 text-black mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <span>Resolution</span>
                        {issue.paragraphs?.resolution && <CitationButton paragraphs={issue.paragraphs.resolution} onParagraphClick={onParagraphClick} />}
                      </div>
                      <p className="text-sm text-black/60 mt-1">{issue.resolution}</p>
                    </div>
                  </div>
                )}
                <Separator className="bg-black/10" />
                {issue.reasoning && (
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-black/40 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <span>Reasoning</span>
                        {issue.paragraphs?.reasoning && <CitationButton paragraphs={issue.paragraphs.reasoning} onParagraphClick={onParagraphClick} />}
                      </div>
                      <p className="text-sm text-black/60 mt-1">{issue.reasoning}</p>
                    </div>
                  </div>
                )}
                {issue.significance && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-black/40 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Significance</div>
                      <p className="text-sm text-black/60 mt-1">{issue.significance}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

