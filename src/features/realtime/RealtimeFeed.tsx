import { useEffect, useState } from 'react'
import { Card } from '@/components/Card'
import type { RawEvent } from '@/data/types'
import { capitalize, formatDeviceLabel } from '@/lib/text'

function relativeTime(timestamp: number, now: number): string {
  const diffSeconds = Math.max(0, Math.round((now - timestamp) / 1000))
  if (diffSeconds < 60) return `há ${diffSeconds}s`
  return `há ${Math.round(diffSeconds / 60)}min`
}

export interface RealtimeFeedProps {
  events: RawEvent[]
}

export function RealtimeFeed({ events }: RealtimeFeedProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <Card>
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 animate-pulse rounded-full bg-good"
        />
        <h2 className="text-lg font-semibold text-ink">
          Eventos em tempo real
        </h2>
      </div>
      <ul className="mt-4 flex max-h-[32rem] flex-col divide-y divide-border overflow-y-auto">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-center justify-between gap-3 py-2 text-sm"
          >
            <span className="font-medium text-ink">{event.name}</span>
            <span className="text-ink-secondary">
              {formatDeviceLabel(event.device)} · {capitalize(event.channel)}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-ink-muted">
              {relativeTime(event.timestamp, now)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
