import { StatTile } from '@/components/StatTile'
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
} from '@/data/selectors'
import { FilterBar } from '@/features/filters/FilterBar'
import { useProductFilters } from '@/features/filters/useProductFilters'
import { FunnelJourney } from '@/features/product-health/FunnelJourney'

export function ProductHealthPage() {
  const filters = useProductFilters()
  const dataset = getDataset()

  const range = rangeFromPreset(dataset, filters.range)
  const previous = previousRange(range)

  const dau = averageDau(dataset, range)
  const dauDelta = percentChange(dau, averageDau(dataset, previous))

  const churn = averageChurnRate(dataset, range)
  const churnDelta = percentChange(churn, averageChurnRate(dataset, previous))

  const totals = funnelTotalsForFilter(dataset, range, filters.device)
  const previousTotals = funnelTotalsForFilter(
    dataset,
    previous,
    filters.device,
  )
  const conversionDelta = percentChange(
    totals.conversionRate,
    previousTotals.conversionRate,
  )

  // Retenção de coorte não é recortada por período/device: coortes
  // semanais precisam de várias semanas de histórico para existir.
  const retention = averageWeek1Retention(dataset)

  const steps = funnelStepDropOff(totals)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-ink">Product Health</h1>
        <FilterBar {...filters} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="DAU"
          value={Math.round(dau).toLocaleString('pt-BR')}
          delta={dauDelta ?? undefined}
          deltaLabel="vs. período anterior"
        />
        <StatTile
          label="Retention (semana 1)"
          value={`${retention.toFixed(1)}%`}
        />
        <StatTile
          label="Conversion"
          value={`${totals.conversionRate.toFixed(2)}%`}
          delta={conversionDelta ?? undefined}
          deltaLabel="vs. período anterior"
        />
        <StatTile
          label="Churn"
          value={`${churn.toFixed(1)}%`}
          delta={churnDelta ?? undefined}
          deltaLabel="vs. período anterior"
          positiveDirection="down"
        />
      </div>

      <FunnelJourney steps={steps} />
    </div>
  )
}
