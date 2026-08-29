import { getDataset } from '@/data'
import { RealtimeFeed } from '@/features/realtime/RealtimeFeed'

export function RealtimePage() {
  const dataset = getDataset()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink">Realtime Events</h1>
      <RealtimeFeed events={dataset.recentEvents} />
    </div>
  )
}
