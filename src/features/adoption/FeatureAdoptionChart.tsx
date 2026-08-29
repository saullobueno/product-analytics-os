import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/Card'

export interface AdoptionDatum {
  feature: string
  count: number
}

export interface FeatureAdoptionChartProps {
  data: AdoptionDatum[]
}

/** Ranking = magnitude ordinal, um hue só (ver skill dataviz). */
export function FeatureAdoptionChart({ data }: FeatureAdoptionChartProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">
        Adoção de features (últimos 45 min)
      </h2>
      <div className="mt-4" style={{ height: Math.max(200, data.length * 36) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--color-gridline)" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: 'var(--color-ink-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="feature"
              type="category"
              width={170}
              tick={{ fill: 'var(--color-ink-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
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
              dataKey="count"
              name="Eventos"
              fill="var(--color-series-1)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
