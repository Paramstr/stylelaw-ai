import { History, ArrowRight } from "lucide-react"
import { CitationButton } from "./citation-button"
import type { CaseData } from "@/../types/caseData"

interface HistoryTabProps {
  history: CaseData["history"]
  onParagraphClick?: (paragraph: number) => void
}

export function HistoryTab({ history, onParagraphClick }: HistoryTabProps) {
  if (!history?.procedural?.length && !history?.related?.length && !history?.subsequent?.length) {
    return (
      <div className="p-8">
        <h4 className="text-lg font-light mb-6 flex items-center gap-2">
          <History className="w-5 h-5" />
          Case History
        </h4>
        <div className="text-sm text-black/60">No history data available.</div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h4 className="text-lg font-light mb-6 flex items-center gap-2">
        <History className="w-5 h-5" />
        Case History
      </h4>
      <div className="space-y-6">
        {history.procedural && history.procedural.length > 0 && (
          <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
            <h5 className="text-sm font-medium mb-4">Procedural History</h5>
            <ul className="space-y-4">
              {history.procedural.map((event, index) => {
                if (!event) return null;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {event.date}: {event.event}
                      </p>
                      <p className="text-sm text-black/60 mt-1">{event.outcome}</p>
                      {event.paragraphs && event.paragraphs.length > 0 && (
                        <div className="mt-2">
                          <CitationButton paragraphs={event.paragraphs} onParagraphClick={onParagraphClick} />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {history.related && history.related.length > 0 && (
          <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
            <h5 className="text-sm font-medium mb-4">Related Cases</h5>
            <ul className="space-y-4">
              {history.related.map((relatedCase, index) => {
                if (!relatedCase) return null;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{relatedCase.citation}</p>
                      <p className="text-sm text-black/60">Relationship: {relatedCase.relationship}</p>
                      <p className="text-sm text-black/60">Status: {relatedCase.status}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {history.subsequent && history.subsequent.length > 0 && (
          <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
            <h5 className="text-sm font-medium mb-4">Subsequent Treatment</h5>
            <ul className="space-y-4">
              {history.subsequent.map((subsequentCase, index) => {
                if (!subsequentCase) return null;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{subsequentCase.citation}</p>
                      <p className="text-sm text-black/60">Treatment: {subsequentCase.treatment}</p>
                      <p className="text-sm text-black/60">Impact: {subsequentCase.impact}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

