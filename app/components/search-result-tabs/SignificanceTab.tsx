import { ArrowRight, Check, AlertCircle } from "lucide-react"
import { CitationButton } from "../citation-button"
import type { CaseData } from "@/../types/caseData"

interface SignificanceTabProps {
  practice: CaseData["practice"]
  onParagraphClick?: (paragraph: number) => void
}

export function SignificanceTab({ practice, onParagraphClick }: SignificanceTabProps) {
  if (!practice?.significance) {
    return (
      <div className="p-8">
        <h4 className="text-xl font-medium mb-6">Significance and Applicability</h4>
        <div className="text-sm text-black/60">No significance data available.</div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h4 className="text-xl font-medium mb-6">Significance and Applicability</h4>
      <div className="space-y-6">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-medium mb-4 flex items-center gap-2">
                <span>Precedent Value</span>
                {practice.significance.paragraphs && practice.significance.paragraphs.length > 0 && (
                  <CitationButton paragraphs={practice.significance.paragraphs} onParagraphClick={onParagraphClick} />
                )}
              </h5>
              <p className="text-sm text-black/60">{practice.significance.precedentValue}</p>
            </div>

            {practice.significance.implications && practice.significance.implications.length > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-3">Implications</h5>
                <ul className="space-y-3">
                  {practice.significance.implications.map((implication, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                      <span className="text-sm text-black/60">{implication}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practice.applicability?.keyFactors && practice.applicability.keyFactors.length > 0 && (
            <div className="p-6">
              <h5 className="text-sm font-medium mb-4">Key Factors</h5>
              <ul className="space-y-3">
                {practice.applicability.keyFactors.map((factor, index) => {
                  if (!factor) return null;
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-black mt-1 shrink-0" />
                      <div className="flex-1">
                        <span className="text-sm text-black/60">{factor.factor}</span>
                        {factor.paragraphs && factor.paragraphs.length > 0 && (
                          <div className="mt-1">
                            <CitationButton paragraphs={factor.paragraphs} onParagraphClick={onParagraphClick} />
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {practice.applicability?.limitations && (
            <div className="p-6">
              <h5 className="text-sm font-medium mb-4">Limitations</h5>
              <ul className="space-y-3">
                {practice.applicability.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-black/60">{limitation.limitation}</span>
                      {limitation.paragraphs && (
                        <div className="mt-1">
                          <CitationButton paragraphs={limitation.paragraphs} onParagraphClick={onParagraphClick} />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

