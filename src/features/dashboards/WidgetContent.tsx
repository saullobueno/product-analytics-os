import { StatTile } from '@/components/StatTile'
import { FunnelJourney } from '@/features/product-health/FunnelJourney'
import type { HeadlineMetrics } from '@/features/product-health/useHeadlineMetrics'
import type { WidgetType } from './types'

export interface WidgetContentProps {
  type: WidgetType
  metrics: HeadlineMetrics
}

export function WidgetContent({ type, metrics }: WidgetContentProps) {
  switch (type) {
    case 'dau':
      return (
        <StatTile
          label="DAU"
          value={Math.round(metrics.dau).toLocaleString('pt-BR')}
          delta={metrics.dauDelta ?? undefined}
          deltaLabel="vs. período anterior"
        />
      )
    case 'conversion':
      return (
        <StatTile
          label="Conversion"
          value={`${metrics.conversion.toFixed(2)}%`}
          delta={metrics.conversionDelta ?? undefined}
          deltaLabel="vs. período anterior"
        />
      )
    case 'churn':
      return (
        <StatTile
          label="Churn"
          value={`${metrics.churn.toFixed(1)}%`}
          delta={metrics.churnDelta ?? undefined}
          deltaLabel="vs. período anterior"
          positiveDirection="down"
        />
      )
    case 'retention':
      return (
        <StatTile
          label="Retention (semana 1)"
          value={`${metrics.retention.toFixed(1)}%`}
        />
      )
    case 'funnel':
      return <FunnelJourney steps={metrics.funnelSteps} />
  }
}
