import { StatTile } from '@/components/StatTile'
import { getDataset } from '@/data'
import { averageWeek1Retention } from '@/data/selectors'
import { RetentionTrendChart } from '@/features/retention/RetentionTrendChart'

export function RetentionPage() {
  const dataset = getDataset()
  const retention = averageWeek1Retention(dataset)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink">Retention</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Retenção média (semana 1)"
          value={`${retention.toFixed(1)}%`}
        />
      </div>

      <RetentionTrendChart cohorts={dataset.cohorts} />
    </div>
  )
}
