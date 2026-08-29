import { FilterBar } from '@/features/filters/FilterBar'
import { useProductFilters } from '@/features/filters/useProductFilters'
import { FunnelJourney } from '@/features/product-health/FunnelJourney'
import { useHeadlineMetrics } from '@/features/product-health/useHeadlineMetrics'

export function UserJourneyPage() {
  const filters = useProductFilters()
  const metrics = useHeadlineMetrics(filters.range, filters.device)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-ink">User Journey</h1>
        <FilterBar {...filters} />
      </div>
      <FunnelJourney steps={metrics.funnelSteps} title="Funil de ativação" />
    </div>
  )
}
