export interface CaseData {
  pdfFile?: string
  pdfBase64?: string
  coreInfo?: {
    citation?: string
    title?: string
    shortTitle?: string
    court?: string
    jurisdiction?: string
    judgmentDate?: string
    hearingDates?: string[]
    fileNumber?: string
    neutralCitation?: string
    status?: string
  }
  aiSummary?: string
  authorityStatus?: {
    type?: string
    area?: string
    impact?: string
    previousAuthority?: string
  }
  participants?: {
    bench?: Array<{
      name?: string
      role?: string
      isPrimary?: boolean
    }>
    counsel?: Array<{
      name?: string
      party?: string
      firm?: string
    }>
    parties?: {
      applicants?: string[]
      respondents?: string[]
      interventions?: string[]
    }
  }
  classification?: {
    areasOfLaw?: string[]
    subAreas?: string[]
    industry?: string[]
    proceeding?: {
      type?: string
      level?: string
      nature?: string
    }
    monetaryValue?: {
      amount?: number
      type?: string
      currency?: string
    }
  }
  strategy?: {
    keyIssues?: Array<{
      issue?: string
      resolution?: string
      reasoning?: string
      significance?: string
      paragraphs?: {
        issue?: number[]
        resolution?: number[]
        reasoning?: number[]
      }
    }>
    outcome?: {
      summary?: string
      disposition?: string[]
      remedy?: string
      costs?: string
      paragraphs?: {
        disposition?: number[]
        remedy?: number[]
        costs?: number[]
      }
    }
  }
  practice?: {
    significance?: {
      precedentValue?: string
      innovations?: string[]
      implications?: string[]
      paragraphs?: number[]
    }
    applicability?: {
      keyFactors?: Array<{
        factor?: string
        paragraphs?: number[]
      }>
      limitations?: Array<{
        limitation?: string
        paragraphs?: number[]
      }>
      scope?: Array<{
        application?: string
        paragraphs?: number[]
      }>
    }
  }
  history?: {
    procedural?: Array<{
      date?: string
      event?: string
      outcome?: string
      paragraphs?: number[]
    }>
    related?: Array<{
      citation?: string
      relationship?: string
      status?: string
    }>
    subsequent?: Array<{
      citation?: string
      treatment?: string
      impact?: string
    }>
  }
  authorities?: {
    legislation?: Array<{
      title?: string
      provisions?: string[]
      purpose?: string
      treatment?: string
      impact?: string
      paragraphs?: number[]
    }>
    cases?: Array<{
      citation?: string
      purpose?: string
      treatment?: string
      principle?: string
      paragraphs?: number[]
    }>
    keyPassages?: Array<{
      text?: string
      paragraph?: number
      topic?: string
      significance?: string
    }>
  }
}

