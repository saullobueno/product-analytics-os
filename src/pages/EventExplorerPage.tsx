import { getDataset } from '@/data'
import { EventExplorer } from '@/features/events/EventExplorer'

export function EventExplorerPage() {
  const dataset = getDataset()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink">Event Explorer</h1>
      <EventExplorer events={dataset.recentEvents} />
    </div>
  )
}
