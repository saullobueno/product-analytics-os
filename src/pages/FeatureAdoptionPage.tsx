import { getDataset } from '@/data'
import { FeatureAdoptionChart } from '@/features/adoption/FeatureAdoptionChart'

export function FeatureAdoptionPage() {
  const dataset = getDataset()

  const counts = new Map<string, number>()
  for (const event of dataset.recentEvents) {
    counts.set(event.name, (counts.get(event.name) ?? 0) + 1)
  }

  const data = Array.from(counts.entries())
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink">Feature Adoption</h1>
      <FeatureAdoptionChart data={data} />
    </div>
  )
}
