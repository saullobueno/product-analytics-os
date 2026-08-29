import { getDataset } from '@/data'
import { CohortHeatmap } from '@/features/cohorts/CohortHeatmap'

export function CohortsPage() {
  const dataset = getDataset()
  const maxWeeks = dataset.cohorts.reduce(
    (max, cohort) => Math.max(max, cohort.retentionByWeek.length - 1),
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink">Cohorts</h1>
      <CohortHeatmap cohorts={dataset.cohorts} maxWeeks={maxWeeks} />
    </div>
  )
}
