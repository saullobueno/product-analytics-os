import type { DeviceFilter, RangePreset } from '@/data/selectors'
import { cn } from '@/lib/cn'
import type { ProductFilters } from './useProductFilters'

const RANGE_OPTIONS: { value: RangePreset; label: string }[] = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
]

const DEVICE_OPTIONS: { value: DeviceFilter; label: string }[] = [
  { value: 'all', label: 'Todos os devices' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
  { value: 'web', label: 'Web' },
]

function SegmentedGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="flex items-center gap-1">
      <legend className="sr-only">{legend}</legend>
      <div className="flex rounded-lg border border-border p-0.5">
        {options.map((option) => {
          const isActive = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
              className={cn(
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-series-1 text-white'
                  : 'text-ink-secondary hover:text-ink',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function FilterBar({
  range,
  device,
  setRange,
  setDevice,
}: ProductFilters) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SegmentedGroup
        legend="Período"
        options={RANGE_OPTIONS}
        value={range}
        onChange={setRange}
      />
      <SegmentedGroup
        legend="Device"
        options={DEVICE_OPTIONS}
        value={device}
        onChange={setDevice}
      />
    </div>
  )
}
