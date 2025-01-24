import { Book, ArrowRight } from "lucide-react"
import { CitationButton } from "./citation-button"
import type { CaseData } from "../types/caseData"

interface AuthoritiesTabProps {
  authorities: CaseData["authorities"]
}

export function AuthoritiesTab({ authorities }: AuthoritiesTabProps) {
  return (
    <div className="p-8 space-y-8">
      <h4 className="text-lg font-light mb-6 flex items-center gap-2">
        <Book className="w-5 h-5" />
        Authorities
      </h4>

      {/* Legislation Section */}
      <div className="space-y-4">
        <h5 className="font-medium text-base">Legislation</h5>
        <div className="space-y-6">
          {authorities.legislation.map((legislation, index) => (
            <div key={index} className="bg-white border border-black/10 p-6 space-y-2">
              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                <div className="space-y-2 w-full">
                  <h6 className="font-medium">{legislation.title}</h6>
                  <div className="grid gap-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-black/40">Provisions:</span>
                      <span>{legislation.provisions.join(", ")}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-black/40">Purpose:</span>
                      <span>{legislation.purpose}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-black/40">Treatment:</span>
                      <span>{legislation.treatment}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-black/40">Impact:</span>
                      <span>{legislation.impact}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <CitationButton paragraphs={legislation.paragraphs} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cases Section */}
      <div className="space-y-4">
        <h5 className="font-medium text-base">Cases</h5>
        <div className="space-y-6">
          {authorities.cases.map((caseAuthority, index) => (
            <div key={index} className="bg-white border border-black/10 p-6 space-y-2">
              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                <div className="space-y-2 w-full">
                  <h6 className="font-medium">{caseAuthority.citation}</h6>
                  <div className="grid gap-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-black/40">Purpose:</span>
                      <span>{caseAuthority.purpose}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-black/40">Treatment:</span>
                      <span>{caseAuthority.treatment}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-black/40">Principle:</span>
                      <span>{caseAuthority.principle}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <CitationButton paragraphs={caseAuthority.paragraphs} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Passages Section */}
      <div className="space-y-4">
        <h5 className="font-medium text-base">Key Passages</h5>
        <div className="space-y-6">
          {authorities.keyPassages.map((passage, index) => (
            <div key={index} className="bg-white border border-black/10 p-6 space-y-2">
              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                <div className="space-y-2 w-full">
                  <h6 className="font-medium">{passage.topic}</h6>
                  <div className="text-sm italic border-l-2 border-black/10 pl-4 py-2">"{passage.text}"</div>
                  <div className="text-sm">
                    <span className="text-black/40">Significance:</span>
                    <span className="ml-2">{passage.significance}</span>
                  </div>
                  <div className="mt-2">
                    <CitationButton paragraphs={[passage.paragraph]} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

