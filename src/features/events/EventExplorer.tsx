import { useMemo, useState } from 'react'
import { Card } from '@/components/Card'
import { CHANNELS, DEVICE_SEGMENTS } from '@/data/constants'
import type { RawEvent } from '@/data/types'
import { capitalize, formatDeviceLabel } from '@/lib/text'

const ALL = 'all'

export interface EventExplorerProps {
  events: RawEvent[]
}

export function EventExplorer({ events }: EventExplorerProps) {
  const [device, setDevice] = useState<string>(ALL)
  const [channel, setChannel] = useState<string>(ALL)

  const filtered = useMemo(
    () =>
      events.filter(
        (event) =>
          (device === ALL || event.device === device) &&
          (channel === ALL || event.channel === channel),
      ),
    [events, device, channel],
  )

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">
          Eventos ({filtered.length})
        </h2>
        <div className="flex gap-2">
          <select
            aria-label="Filtrar por device"
            value={device}
            onChange={(event) => setDevice(event.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink"
          >
            <option value={ALL}>Todos os devices</option>
            {DEVICE_SEGMENTS.map((option) => (
              <option key={option} value={option}>
                {formatDeviceLabel(option)}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por channel"
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink"
          >
            <option value={ALL}>Todos os channels</option>
            {CHANNELS.map((option) => (
              <option key={option} value={option}>
                {capitalize(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 max-h-[32rem] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-ink-muted">
              <th className="pb-2 font-medium">Evento</th>
              <th className="pb-2 font-medium">Device</th>
              <th className="pb-2 font-medium">Channel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((event) => (
              <tr key={event.id}>
                <td className="py-2 font-medium text-ink">{event.name}</td>
                <td className="py-2 text-ink-secondary">
                  {formatDeviceLabel(event.device)}
                </td>
                <td className="py-2 text-ink-secondary">
                  {capitalize(event.channel)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-ink-secondary">
            Nenhum evento para esses filtros.
          </p>
        )}
      </div>
    </Card>
  )
}
