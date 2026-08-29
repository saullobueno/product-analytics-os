import type { Dataset, DeviceSegment, FunnelStepId } from './types'
import { FUNNEL_STEPS } from './constants'

export interface DateRange {
  start: string
  end: string
}

function inRange(date: string, range?: DateRange): boolean {
  if (!range) return true
  return date >= range.start && date <= range.end
}

export function latestDau(dataset: Dataset): number {
  const last = dataset.dailyMetrics.at(-1)
  return last?.dau ?? 0
}

export function averageChurnRate(dataset: Dataset, range?: DateRange): number {
  const rows = dataset.dailyMetrics.filter((m) => inRange(m.date, range))
  if (rows.length === 0) return 0
  const rate =
    rows.reduce((sum, m) => sum + m.churnedUsers / m.dau, 0) / rows.length
  return rate * 100
}

export interface FunnelTotals {
  counts: Record<FunnelStepId, number>
  conversionRate: number
}

/** Soma os counts do funil no período/segmento, com fallback para todos os devices. */
export function funnelTotals(
  dataset: Dataset,
  options: { range?: DateRange; device?: DeviceSegment } = {},
): FunnelTotals {
  const rows = dataset.funnel.filter(
    (row) =>
      inRange(row.date, options.range) &&
      (!options.device || row.device === options.device),
  )

  const counts = FUNNEL_STEPS.reduce(
    (acc, step) => {
      acc[step.id] = rows.reduce((sum, row) => sum + row.counts[step.id], 0)
      return acc
    },
    {} as Record<FunnelStepId, number>,
  )

  const conversionRate =
    counts.landing > 0 ? (counts.activated / counts.landing) * 100 : 0

  return { counts, conversionRate }
}

export function conversionRateByDevice(
  dataset: Dataset,
  device: DeviceSegment,
  range?: DateRange,
): number {
  return funnelTotals(dataset, { range, device }).conversionRate
}

/** Retenção média na semana 1 dos coortes que já completaram ao menos 1 semana. */
export function averageWeek1Retention(dataset: Dataset): number {
  const eligible = dataset.cohorts.filter((c) => c.retentionByWeek.length > 1)
  if (eligible.length === 0) return 0
  return (
    eligible.reduce((sum, c) => sum + c.retentionByWeek[1], 0) / eligible.length
  )
}

export interface FunnelStepSummary {
  id: FunnelStepId
  label: string
  count: number
  dropOffRate: number
}

export function funnelStepDropOff(totals: FunnelTotals): FunnelStepSummary[] {
  return FUNNEL_STEPS.map((step, index) => {
    const previousCount =
      index === 0
        ? totals.counts.landing
        : totals.counts[FUNNEL_STEPS[index - 1].id]
    const count = totals.counts[step.id]
    const dropOffRate =
      index === 0 || previousCount === 0 ? 0 : 1 - count / previousCount
    return { id: step.id, label: step.label, count, dropOffRate }
  })
}
