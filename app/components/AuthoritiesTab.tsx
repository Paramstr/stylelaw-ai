import { Book, ArrowRight } from "lucide-react"
import { CitationButton } from "./citation-button"
import type { CaseData } from "@/../types/caseData"

interface AuthoritiesTabProps {
  authorities: CaseData["authorities"]
  onParagraphClick?: (paragraph: number) => void
}

export function AuthoritiesTab({ authorities, onParagraphClick }: AuthoritiesTabProps) {
  if (!(authorities?.legislation || []).length && !(authorities?.cases || []).length && !(authorities?.keyPassages || []).length) {
    return (
      <div className="p-8">
        <h4 className="text-lg font-light mb-6 flex items-center gap-2">
          <Book className="w-5 h-5" />
          Authorities and References
        </h4>
        <div className="text-sm text-black/60">No authorities data available.</div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h4 className="text-lg font-light mb-6 flex items-center gap-2">
        <Book className="w-5 h-5" />
        Authorities and References
      </h4>
      <div className="space-y-8">
        {/* Legislation Section */}
        {(authorities?.legislation || []).length > 0 && (
          <div className="space-y-4">
            <h5 className="font-medium text-base">Legislation</h5>
            <div className="space-y-4">
              {(authorities?.legislation || []).map((legislation, index) => {
                if (!legislation) return null;
                return (
                  <div key={index} className="bg-white border border-black/10 p-6">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                      <div className="flex-1 space-y-4">
                        <h6 className="font-medium">{legislation.title}</h6>
                        <div className="space-y-2 text-sm">
                          {legislation.provisions && legislation.provisions.length > 0 && (
                            <div className="flex gap-2">
                              <span className="text-black/40 shrink-0">Provisions:</span>
                              <span>{legislation.provisions.join(", ")}</span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <span className="text-black/40 shrink-0">Purpose:</span>
                            <span>{legislation.purpose}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-black/40 shrink-0">Treatment:</span>
                            <span>{legislation.treatment}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-black/40 shrink-0">Impact:</span>
                            <span>{legislation.impact}</span>
                          </div>
                        </div>
                        {(legislation.paragraphs || []).length > 0 && (
                          <div>
                            <CitationButton paragraphs={legislation.paragraphs} onParagraphClick={onParagraphClick} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cases Section */}
        {(authorities?.cases || []).length > 0 && (
          <div className="space-y-4">
            <h5 className="font-medium text-base">Cases</h5>
            <div className="space-y-4">
              {(authorities?.cases || []).map((caseAuthority, index) => {
                if (!caseAuthority) return null;
                return (
                  <div key={index} className="bg-white border border-black/10 p-6">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                      <div className="flex-1 space-y-4">
                        <h6 className="font-medium">{caseAuthority.citation}</h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex gap-2">
                            <span className="text-black/40 shrink-0">Purpose:</span>
                            <span>{caseAuthority.purpose}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-black/40 shrink-0">Treatment:</span>
                            <span>{caseAuthority.treatment}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-black/40 shrink-0">Principle:</span>
                            <span>{caseAuthority.principle}</span>
                          </div>
                        </div>
                        {(caseAuthority.paragraphs || []).length > 0 && (
                          <div>
                            <CitationButton paragraphs={caseAuthority.paragraphs} onParagraphClick={onParagraphClick} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Key Passages Section */}
        {(authorities?.keyPassages || []).length > 0 && (
          <div className="space-y-4">
            <h5 className="font-medium text-base">Key Passages</h5>
            <div className="space-y-4">
              {(authorities?.keyPassages || []).map((passage, index) => {
                if (!passage) return null;
                return (
                  <div key={index} className="bg-white border border-black/10 p-6">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-black/40 mt-1 shrink-0" />
                      <div className="flex-1 space-y-4">
                        <p className="text-sm">{passage.text}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex gap-2">
                            <span className="text-black/40 shrink-0">Topic:</span>
                            <span>{passage.topic}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-black/40 shrink-0">Significance:</span>
                            <span>{passage.significance}</span>
                          </div>
                        </div>
                        {passage.paragraph && (
                          <div>
                            <CitationButton paragraphs={[passage.paragraph]} onParagraphClick={onParagraphClick} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

