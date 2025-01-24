import { Scale, FileText, Users, Gavel } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CitationButton } from "./citation-button"
import type { CaseData } from "@/../types/caseData"

interface DetailsTabProps {
  classification: CaseData["classification"]
  authorityStatus: CaseData["authorityStatus"]
  participants: CaseData["participants"]
  strategy: CaseData["strategy"]
}

export function DetailsTab({ classification, authorityStatus, participants, strategy }: DetailsTabProps) {
  // Show empty state if no data is available
  const hasData = classification || authorityStatus || participants || strategy
  if (!hasData) {
    return (
      <div className="p-8">
        <h4 className="text-lg font-light mb-6">Case Details</h4>
        <div className="text-sm text-black/60">No details data available.</div>
      </div>
    );
  }

  return (
    <div className="p-8 grid gap-8">
      {/* Outcome Section */}
      {strategy?.outcome && (
        <div className="p-6 border border-black/10 bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
          <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
            <Gavel className="w-4 h-4" />
            Outcome
          </h4>
          <div className="space-y-4">
            {strategy.outcome.summary && (
              <Badge variant="outline" className="rounded-none bg-black text-white border-0">
                {strategy.outcome.summary}
              </Badge>
            )}
            {(strategy.outcome.disposition || []).length > 0 && (
              <ul className="grid gap-3">
                {(strategy.outcome.disposition || []).map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Scale className="w-4 h-4 text-black/40 mt-1" />
                    <span className="text-sm text-black/60">{point}</span>
                  </li>
                ))}
              </ul>
            )}
            {strategy.outcome?.paragraphs?.disposition && strategy.outcome.paragraphs.disposition.length > 0 && (
              <div className="text-sm flex items-center">
                <span className="font-medium">Disposition:</span>
                <CitationButton paragraphs={strategy.outcome.paragraphs.disposition} />
              </div>
            )}
            {strategy.outcome.remedy && (
              <div className="text-sm flex items-center">
                <span className="font-medium">Remedy: </span>
                <span className="text-black/60">{strategy.outcome.remedy}</span>
                {strategy.outcome?.paragraphs?.remedy && strategy.outcome.paragraphs.remedy.length > 0 && (
                  <CitationButton paragraphs={strategy.outcome.paragraphs.remedy} />
                )}
              </div>
            )}
            {strategy.outcome.costs && (
              <div className="text-sm flex items-center">
                <span className="font-medium">Costs: </span>
                <span className="text-black/60">{strategy.outcome.costs}</span>
                {strategy.outcome?.paragraphs?.costs && strategy.outcome.paragraphs.costs.length > 0 && (
                  <CitationButton paragraphs={strategy.outcome.paragraphs.costs} />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Core Details Grid */}
      {(classification?.proceeding || classification?.monetaryValue) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Proceeding Details */}
          {classification?.proceeding && (
            <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
              <h4 className="text-sm font-medium mb-4">Proceeding Details</h4>
              <dl className="space-y-3">
                {classification.proceeding.type && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-black/40">Type</dt>
                    <dd className="text-sm font-medium">{classification.proceeding.type}</dd>
                  </div>
                )}
                {classification.proceeding.level && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-black/40">Level</dt>
                    <dd className="text-sm font-medium">{classification.proceeding.level}</dd>
                  </div>
                )}
                {classification.proceeding.nature && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-black/40">Nature</dt>
                    <dd className="text-sm font-medium">{classification.proceeding.nature}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Monetary Value */}
          {classification?.monetaryValue && (
            <div className="p-6 border border-black/10 bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors">
              <div className="space-y-2">
                <div className="text-2xl font-light text-emerald-950">
                  {new Intl.NumberFormat("en-NZ", {
                    style: "currency",
                    currency: classification.monetaryValue.currency || "NZD",
                  }).format(classification.monetaryValue.amount || 0)}
                </div>
                {classification.monetaryValue.type && (
                  <p className="text-sm text-black/60">{classification.monetaryValue.type}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Authority Status */}
      {authorityStatus && (
        <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
          <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Authority Status
          </h4>
          <dl className="space-y-3">
            {authorityStatus.type && (
              <div className="flex justify-between">
                <dt className="text-sm text-black/40">Type</dt>
                <dd className="text-sm font-medium">{authorityStatus.type}</dd>
              </div>
            )}
            {authorityStatus.area && (
              <div className="flex justify-between">
                <dt className="text-sm text-black/40">Area</dt>
                <dd className="text-sm font-medium">{authorityStatus.area}</dd>
              </div>
            )}
            {authorityStatus.impact && (
              <div className="flex justify-between">
                <dt className="text-sm text-black/40">Impact</dt>
                <dd className="text-sm font-medium">{authorityStatus.impact}</dd>
              </div>
            )}
            {authorityStatus.previousAuthority && (
              <div className="flex justify-between">
                <dt className="text-sm text-black/40">Previous Authority</dt>
                <dd className="text-sm font-medium">{authorityStatus.previousAuthority}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Participants Section */}
      {(participants?.bench || []).length > 0 && (
        <div className="p-6 border border-black/10 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors">
          <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Participants
          </h4>
          <div className="grid gap-4">
            <div>
              <h5 className="text-xs font-medium text-black/40 mb-2">Bench</h5>
              <ul className="space-y-1">
                {(participants?.bench || []).map((judge, index) => {
                  if (!judge?.name || !judge?.role) return null;
                  return (
                    <li key={index} className="text-sm">
                      {judge.name} - {judge.role}
                      {judge.isPrimary && <span className="text-emerald-600 ml-1">(Primary)</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
            {(participants?.counsel || []).length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-black/40 mb-2">Counsel</h5>
                <ul className="space-y-1">
                  {(participants?.counsel || []).map((counsel, index) => {
                    if (!counsel?.name || !counsel?.party) return null;
                    return (
                      <li key={index} className="text-sm">
                        {counsel.name} - {counsel.party}
                        {counsel.firm && <span className="text-black/60 ml-1">({counsel.firm})</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {((participants?.parties?.applicants || []).length > 0 || (participants?.parties?.respondents || []).length > 0) && (
              <div>
                <h5 className="text-xs font-medium text-black/40 mb-2">Parties</h5>
                <div className="grid grid-cols-2 gap-4">
                  {(participants?.parties?.applicants || []).length > 0 && (
                    <div>
                      <h6 className="text-xs font-medium text-black/60 mb-1">Applicants</h6>
                      <ul className="space-y-1">
                        {(participants?.parties?.applicants || []).map((applicant, index) => (
                          <li key={index} className="text-sm">
                            {applicant}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(participants?.parties?.respondents || []).length > 0 && (
                    <div>
                      <h6 className="text-xs font-medium text-black/60 mb-1">Respondents</h6>
                      <ul className="space-y-1">
                        {(participants?.parties?.respondents || []).map((respondent, index) => (
                          <li key={index} className="text-sm">
                            {respondent}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

