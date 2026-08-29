import { getDataset } from '@/data'
import {
  averageChurnRate,
  averageDau,
  averageWeek1Retention,
  funnelStepDropOff,
  funnelTotalsForFilter,
  percentChange,
  previousRange,
  rangeFromPreset,
  type DeviceFilter,
  type FunnelStepSummary,
  type RangePreset,
} from '@/data/selectors'

export interface HeadlineMetrics {
  dau: number
  dauDelta: number | null
  churn: number
  churnDelta: number | null
  conversion: number
  conversionDelta: number | null
  retention: number
  funnelSteps: FunnelStepSummary[]
}

/** Compartilhado por Product Health e pelos widgets do Dashboard (ver ADR 0006). */
export function useHeadlineMetrics(
  rangePreset: RangePreset,
  device: DeviceFilter,
): HeadlineMetrics {
  const dataset = getDataset()
  const range = rangeFromPreset(dataset, rangePreset)
  const previous = previousRange(range)

  const dau = averageDau(dataset, range)
  const dauDelta = percentChange(dau, averageDau(dataset, previous))

  const churn = averageChurnRate(dataset, range)
  const churnDelta = percentChange(churn, averageChurnRate(dataset, previous))

  const totals = funnelTotalsForFilter(dataset, range, device)
  const previousTotals = funnelTotalsForFilter(dataset, previous, device)
  const conversionDelta = percentChange(
    totals.conversionRate,
    previousTotals.conversionRate,
  )

  // Retenção de coorte não é recortada por período/device: coortes
  // semanais precisam de várias semanas de histórico para existir.
  const retention = averageWeek1Retention(dataset)

  return {
    dau,
    dauDelta,
    churn,
    churnDelta,
    conversion: totals.conversionRate,
    conversionDelta,
    retention,
    funnelSteps: funnelStepDropOff(totals),
  }
}
