import { differenceInCalendarDays, format, subDays } from 'date-fns'
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

export type RangePreset = '7d' | '30d' | '90d'

const RANGE_PRESET_DAYS: Record<RangePreset, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

/** Converte um preset (7d/30d/90d) num DateRange concreto, terminando no fim do dataset. */
export function rangeFromPreset(
  dataset: Dataset,
  preset: RangePreset,
): DateRange {
  const end = new Date(dataset.dateRange.end)
  const start = subDays(end, RANGE_PRESET_DAYS[preset] - 1)
  return { start: format(start, 'yyyy-MM-dd'), end: dataset.dateRange.end }
}

/** Período imediatamente anterior, de mesma duração — para comparação "vs. período anterior". */
export function previousRange(range: DateRange): DateRange {
  const days = differenceInCalendarDays(range.end, range.start) + 1
  const end = subDays(range.start, 1)
  const start = subDays(end, days - 1)
  return { start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') }
}

/** Variação percentual entre dois valores; null se a base não permitir comparar. */
export function percentChange(
  current: number,
  previous: number,
): number | null {
  if (previous <= 0) return null
  return ((current - previous) / previous) * 100
}

export function latestDau(dataset: Dataset): number {
  const last = dataset.dailyMetrics.at(-1)
  return last?.dau ?? 0
}

export function averageDau(dataset: Dataset, range?: DateRange): number {
  const rows = dataset.dailyMetrics.filter((m) => inRange(m.date, range))
  if (rows.length === 0) return 0
  return rows.reduce((sum, m) => sum + m.dau, 0) / rows.length
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

export type DeviceFilter = 'all' | DeviceSegment

export function funnelTotalsForFilter(
  dataset: Dataset,
  range: DateRange,
  device: DeviceFilter,
): FunnelTotals {
  return funnelTotals(dataset, {
    range,
    device: device === 'all' ? undefined : device,
  })
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
  /** Queda percentual em relação ao passo anterior (0 no primeiro passo). */
  dropOffRate: number
  /** % do landing que chegou a este passo (100 no primeiro passo). */
  retainedFromLandingRate: number
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
    const retainedFromLandingRate =
      totals.counts.landing === 0 ? 0 : (count / totals.counts.landing) * 100
    return {
      id: step.id,
      label: step.label,
      count,
      dropOffRate,
      retainedFromLandingRate,
    }
  })
}
