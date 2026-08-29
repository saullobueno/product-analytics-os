import { DEVICE_SEGMENTS } from '@/data/constants'
import { getDataset } from '@/data'
import {
  funnelStepDropOff,
  funnelTotals,
  rangeFromPreset,
} from '@/data/selectors'
import { FunnelJourney } from '@/features/product-health/FunnelJourney'
import { formatDeviceLabel } from '@/lib/text'

export function FunnelsPage() {
  const dataset = getDataset()
  const range = rangeFromPreset(dataset, '30d')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-ink">Funnels</h1>
      <p className="text-sm text-ink-secondary">
        Comparação lado a lado do funil de ativação por device (últimos 30
        dias).
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {DEVICE_SEGMENTS.map((device) => {
          const totals = funnelTotals(dataset, { range, device })
          return (
            <div key={device} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-ink-secondary">
                {formatDeviceLabel(device)}
              </h2>
              <FunnelJourney steps={funnelStepDropOff(totals)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
