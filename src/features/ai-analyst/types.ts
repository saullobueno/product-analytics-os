export type AnalyzableMetric = 'conversion' | 'churn' | 'retention' | 'dau'

export interface InsightReport {
  recognized: true
  question: string
  metric: AnalyzableMetric
  /** ex.: "Conversion decreased 8.4%." */
  headline: string
  direction: 'up' | 'down' | 'flat'
  /** Rótulo curto da causa raiz mais provável, se houver evidência suficiente. */
  primaryFactor: string | null
  evidence: string[]
  /** 0-100 — heurística determinística (ver computeConfidence), não uma probabilidade real de modelo. */
  confidence: number
}

export interface UnrecognizedQuestion {
  question: string
  recognized: false
}

export type AnalystAnswer = InsightReport | UnrecognizedQuestion
