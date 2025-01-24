import { ArrowRight, Check, AlertCircle } from "lucide-react"
import { CitationButton } from "./citation-button"
import type { CaseData } from "../types/caseData"

interface SignificanceTabProps {
  practice: CaseData["practice"]
}

export function SignificanceTab({ practice }: SignificanceTabProps) {
  return (
    <div className="p-8">
      <h4 className="text-lg font-light mb-6">Significance and Applicability</h4>
      <div className="grid gap-8">
        <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
          <h5 className="text-sm font-medium mb-4 flex items-center">
            Precedent Value
            <CitationButton paragraphs={practice.significance.paragraphs} />
          </h5>
          <p className="text-sm text-black/60">{practice.significance.precedentValue}</p>

          <h5 className="text-sm font-medium mt-6 mb-3">Implications</h5>
          <ul className="grid gap-3">
            {practice.significance.implications.map((implication, index) => (
              <li key={index} className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-black/40 mt-1" />
                <span className="text-sm text-black/60">{implication}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
            <h5 className="text-sm font-medium mb-4">Key Factors</h5>
            <ul className="grid gap-3">
              {practice.applicability.keyFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-black mt-1" />
                  <span className="text-sm text-black/60">{factor.factor}</span>
                  <CitationButton paragraphs={factor.paragraphs} />
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
            <h5 className="text-sm font-medium mb-4">Limitations</h5>
            <ul className="grid gap-3">
              {practice.applicability.limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-black/40 mt-1" />
                  <span className="text-sm text-black/60">{limitation.limitation}</span>
                  <CitationButton paragraphs={limitation.paragraphs} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

