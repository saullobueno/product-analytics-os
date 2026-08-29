import { DEVICE_SEGMENTS } from '@/data/constants'
import type { Dataset } from '@/data/types'
import {
  averageChurnRate,
  averageDau,
  conversionRateByDevice,
  funnelStepDropOff,
  funnelTotals,
  percentChange,
  previousRange,
  rangeFromPreset,
} from '@/data/selectors'
import { formatReleaseDate, formatSignedPercent } from '@/lib/format'
import { formatDeviceLabel } from '@/lib/text'
import type { AnalystAnswer, AnalyzableMetric, InsightReport } from './types'

const METRIC_KEYWORDS: Record<AnalyzableMetric, string[]> = {
  conversion: ['conversao', 'conversion'],
  churn: ['churn', 'cancelamento'],
  retention: ['retencao', 'retention'],
  dau: ['dau', 'usuarios ativos', 'active users'],
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function matchMetric(question: string): AnalyzableMetric | null {
  const normalized = normalize(question)
  const entries = Object.entries(METRIC_KEYWORDS) as [
    AnalyzableMetric,
    string[],
  ][]
  for (const [metric, keywords] of entries) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return metric
    }
  }
  return null
}

/**
 * Heurística determinística (não é uma probabilidade de modelo real):
 * cresce com o tamanho da queda/alta, com um release correlacionado no
 * tempo, e com a causa estar concentrada num único segmento em vez de
 * espalhada — ver ADR da fase 4.
 */
export function computeConfidence(params: {
  magnitudePct: number
  releaseAligned: boolean
  concentrated: boolean
}): number {
  let score = 50
  score += Math.min(25, params.magnitudePct * 1.5)
  if (params.releaseAligned) score += 15
  if (params.concentrated) score += 8
  return Math.round(Math.min(96, Math.max(30, score)))
}

function directionOf(change: number): 'up' | 'down' | 'flat' {
  if (change < -0.05) return 'down'
  if (change > 0.05) return 'up'
  return 'flat'
}

function directionVerb(direction: 'up' | 'down' | 'flat'): string {
  if (direction === 'down') return 'decreased'
  if (direction === 'up') return 'increased'
  return 'held steady'
}

function findAlignedRelease(dataset: Dataset, start: string, end: string) {
  return dataset.releases.find((r) => r.date >= start && r.date <= end)
}

function analyzeConversion(dataset: Dataset, question: string): InsightReport {
  const range = rangeFromPreset(dataset, '7d')
  const previous = previousRange(range)

  const current = funnelTotals(dataset, { range })
  const prior = funnelTotals(dataset, { range: previous })
  const change =
    percentChange(current.conversionRate, prior.conversionRate) ?? 0

  const deviceChanges = DEVICE_SEGMENTS.map((device) => {
    const currentRate = conversionRateByDevice(dataset, device, range)
    const priorRate = conversionRateByDevice(dataset, device, previous)
    return {
      device,
      change: percentChange(currentRate, priorRate) ?? 0,
    }
  })

  const worstDevice = deviceChanges.reduce((worst, candidate) =>
    candidate.change < worst.change ? candidate : worst,
  )
  const others = deviceChanges.filter((d) => d.device !== worstDevice.device)
  const othersAvgChange =
    others.reduce((sum, d) => sum + d.change, 0) / others.length
  const concentrated = worstDevice.change < othersAvgChange - 5

  const currentSteps = funnelStepDropOff(
    funnelTotals(dataset, { range, device: worstDevice.device }),
  )
  const priorSteps = funnelStepDropOff(
    funnelTotals(dataset, { range: previous, device: worstDevice.device }),
  )

  let worstStepIndex = 1
  let worstStepIncrease = -Infinity
  for (let i = 1; i < currentSteps.length; i++) {
    const increase = currentSteps[i].dropOffRate - priorSteps[i].dropOffRate
    if (increase > worstStepIncrease) {
      worstStepIncrease = increase
      worstStepIndex = i
    }
  }
  // dropOffRate[i] mede quem se perdeu saindo do passo i-1 rumo ao
  // passo i — o abandono "pertence" ao passo de origem (i-1), não ao
  // de destino (ex.: piora de onboarding→activated é "abandono no
  // Onboarding", como no diferencial do produto).
  const abandonedAtStep = currentSteps[worstStepIndex - 1]

  const release = findAlignedRelease(dataset, previous.start, range.end)

  const evidence: string[] = [
    `${formatDeviceLabel(worstDevice.device)} conversion ${formatSignedPercent(worstDevice.change, 0)}`,
    `${abandonedAtStep.label} abandonment ${formatSignedPercent(worstStepIncrease * 100, 0)}`,
  ]
  if (release) {
    evidence.push(
      `Release ${release.version} deployed ${formatReleaseDate(release.date)}`,
    )
  }

  const isMobile =
    worstDevice.device === 'android' || worstDevice.device === 'ios'
  const primaryFactor =
    release && isMobile
      ? 'Mobile onboarding'
      : `${abandonedAtStep.label} · ${formatDeviceLabel(worstDevice.device)}`

  const direction = directionOf(change)

  return {
    recognized: true,
    question,
    metric: 'conversion',
    headline: `Conversion ${directionVerb(direction)} ${Math.abs(change).toFixed(1)}%.`,
    direction,
    primaryFactor,
    evidence,
    confidence: computeConfidence({
      magnitudePct: Math.abs(change),
      releaseAligned: Boolean(release),
      concentrated,
    }),
  }
}

function analyzeDailyMetric(
  dataset: Dataset,
  question: string,
  metric: 'dau' | 'churn',
): InsightReport {
  const range = rangeFromPreset(dataset, '7d')
  const previous = previousRange(range)

  const currentValue =
    metric === 'dau'
      ? averageDau(dataset, range)
      : averageChurnRate(dataset, range)
  const priorValue =
    metric === 'dau'
      ? averageDau(dataset, previous)
      : averageChurnRate(dataset, previous)
  const change = percentChange(currentValue, priorValue) ?? 0

  const release = findAlignedRelease(dataset, previous.start, range.end)
  const label = metric === 'dau' ? 'DAU' : 'Churn'
  const formattedValue =
    metric === 'dau'
      ? Math.round(currentValue).toLocaleString('pt-BR')
      : `${currentValue.toFixed(1)}%`

  const evidence = [
    `Média diária no período: ${formattedValue}`,
    release
      ? `Release ${release.version} deployed ${formatReleaseDate(release.date)}`
      : 'Nenhum release conhecido neste período',
  ]

  const direction = directionOf(change)

  return {
    recognized: true,
    question,
    metric,
    headline: `${label} ${directionVerb(direction)} ${Math.abs(change).toFixed(1)}%.`,
    direction,
    primaryFactor: release ? `Release ${release.version}` : null,
    evidence,
    confidence: computeConfidence({
      magnitudePct: Math.abs(change),
      releaseAligned: Boolean(release),
      concentrated: false,
    }),
  }
}

function analyzeRetention(dataset: Dataset, question: string): InsightReport {
  const eligible = dataset.cohorts.filter((c) => c.retentionByWeek.length > 1)
  const latest = eligible.at(-1)
  const prior = eligible.at(-2)

  const currentValue = latest?.retentionByWeek[1] ?? 0
  const priorValue = prior?.retentionByWeek[1] ?? 0
  const change = percentChange(currentValue, priorValue) ?? 0

  const evidence = [
    `Retenção semana 1 do coorte de ${latest?.cohortWeekStart ?? '—'}: ${currentValue.toFixed(0)}%`,
    prior
      ? `Coorte anterior (${prior.cohortWeekStart}): ${priorValue.toFixed(0)}%`
      : 'Sem coorte anterior suficiente para comparar',
  ]

  const direction = directionOf(change)

  return {
    recognized: true,
    question,
    metric: 'retention',
    headline: `Week-1 retention ${directionVerb(direction)} ${Math.abs(change).toFixed(1)}%.`,
    direction,
    primaryFactor: null,
    evidence,
    confidence: computeConfidence({
      magnitudePct: Math.abs(change),
      releaseAligned: false,
      concentrated: false,
    }),
  }
}

export function answerQuestion(
  dataset: Dataset,
  question: string,
): AnalystAnswer {
  const metric = matchMetric(question)
  if (!metric) return { question, recognized: false }

  switch (metric) {
    case 'conversion':
      return analyzeConversion(dataset, question)
    case 'dau':
      return analyzeDailyMetric(dataset, question, 'dau')
    case 'churn':
      return analyzeDailyMetric(dataset, question, 'churn')
    case 'retention':
      return analyzeRetention(dataset, question)
  }
}
