import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/Card'
import type { CohortRetentionRow } from '@/data/types'

export interface RetentionTrendChartProps {
  cohorts: CohortRetentionRow[]
}

export function RetentionTrendChart({ cohorts }: RetentionTrendChartProps) {
  const data = cohorts
    .filter((cohort) => cohort.retentionByWeek.length > 1)
    .map((cohort) => ({
      cohort: cohort.cohortWeekStart,
      week1: cohort.retentionByWeek[1],
    }))

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">
        Retenção semana 1 por coorte
      </h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--color-gridline)" vertical={false} />
            <XAxis
              dataKey="cohort"
              tick={{ fill: 'var(--color-ink-muted)', fontSize: 11 }}
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
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--color-ink)' }}
              itemStyle={{ color: 'var(--color-ink-secondary)' }}
            />
            <Line
              type="monotone"
              dataKey="week1"
              name="Retenção semana 1"
              stroke="var(--color-series-1)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
