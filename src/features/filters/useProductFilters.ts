import { useSearchParams } from 'react-router-dom'
import type { DeviceFilter, RangePreset } from '@/data/selectors'

const RANGE_PRESETS: readonly RangePreset[] = ['7d', '30d', '90d']
const DEVICE_FILTERS: readonly DeviceFilter[] = ['all', 'android', 'ios', 'web']

function isRangePreset(value: string | null): value is RangePreset {
  return RANGE_PRESETS.includes(value as RangePreset)
}

function isDeviceFilter(value: string | null): value is DeviceFilter {
  return DEVICE_FILTERS.includes(value as DeviceFilter)
}

export interface ProductFilters {
  range: RangePreset
  device: DeviceFilter
  setRange: (range: RangePreset) => void
  setDevice: (device: DeviceFilter) => void
}

/**
 * Filtros de período/segmento persistidos na URL (?range=&device=) —
 * sobrevivem a reload e são compartilháveis, sem estado global extra.
 */
export function useProductFilters(): ProductFilters {
  const [searchParams, setSearchParams] = useSearchParams()

  const rangeParam = searchParams.get('range')
  const deviceParam = searchParams.get('device')
  const range = isRangePreset(rangeParam) ? rangeParam : '30d'
  const device = isDeviceFilter(deviceParam) ? deviceParam : 'all'

  const setRange = (next: RangePreset) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        params.set('range', next)
        return params
      },
      { replace: true },
    )
  }

  const setDevice = (next: DeviceFilter) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        params.set('device', next)
        return params
      },
      { replace: true },
    )
  }

  return { range, device, setRange, setDevice }
}
