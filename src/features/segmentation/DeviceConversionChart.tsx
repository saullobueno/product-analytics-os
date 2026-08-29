import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/Card'
import { formatDeviceLabel } from '@/lib/text'

export interface DeviceConversionDatum {
  device: string
  conversionRate: number
}

const DEVICE_COLORS = [
  'var(--color-series-1)',
  'var(--color-series-2)',
  'var(--color-series-3)',
]

export interface DeviceConversionChartProps {
  data: DeviceConversionDatum[]
}

/**
 * Comparação categórica entre 3 devices — dentro do teto de 3 slots
 * que validam all-pairs em ambos os modos (ver skill dataviz).
 */
export function DeviceConversionChart({ data }: DeviceConversionChartProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">
        Conversão por device (30 dias)
      </h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--color-gridline)" vertical={false} />
            <XAxis
              dataKey="device"
              tickFormatter={formatDeviceLabel}
              tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-baseline)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--color-ink-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
              unit="%"
            />
            <Tooltip
              formatter={(value) => `${Number(value).toFixed(2)}%`}
              labelFormatter={(label) => formatDeviceLabel(String(label))}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--color-ink)' }}
              itemStyle={{ color: 'var(--color-ink-secondary)' }}
            />
            <Bar
              dataKey="conversionRate"
              name="Conversão"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.device}
                  fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
