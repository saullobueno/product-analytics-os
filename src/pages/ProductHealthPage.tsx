import { StatTile } from '@/components/StatTile'
import { getDataset } from '@/data'
import { detectConversionAnomalies } from '@/data/selectors'
import { FilterBar } from '@/features/filters/FilterBar'
import { useProductFilters } from '@/features/filters/useProductFilters'
import { AnomalyList } from '@/features/product-health/AnomalyList'
import { FunnelJourney } from '@/features/product-health/FunnelJourney'
import { useHeadlineMetrics } from '@/features/product-health/useHeadlineMetrics'

export function ProductHealthPage() {
  const filters = useProductFilters()
  const metrics = useHeadlineMetrics(filters.range, filters.device)
  const dataset = getDataset()
  const anomalies = detectConversionAnomalies(
    dataset,
    filters.device === 'all' ? undefined : filters.device,
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-ink">Product Health</h1>
        <FilterBar {...filters} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="DAU"
          value={Math.round(metrics.dau).toLocaleString('pt-BR')}
          delta={metrics.dauDelta ?? undefined}
          deltaLabel="vs. período anterior"
        />
        <StatTile
          label="Retention (semana 1)"
          value={`${metrics.retention.toFixed(1)}%`}
        />
        <StatTile
          label="Conversion"
          value={`${metrics.conversion.toFixed(2)}%`}
          delta={metrics.conversionDelta ?? undefined}
          deltaLabel="vs. período anterior"
        />
        <StatTile
          label="Churn"
          value={`${metrics.churn.toFixed(1)}%`}
          delta={metrics.churnDelta ?? undefined}
          deltaLabel="vs. período anterior"
          positiveDirection="down"
        />
      </div>

      <AnomalyList anomalies={anomalies} />
      <FunnelJourney steps={metrics.funnelSteps} />
    </div>
  )
}
