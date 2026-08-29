export type WidgetType = 'dau' | 'conversion' | 'churn' | 'retention' | 'funnel'

export interface DashboardWidget {
  id: string
  type: WidgetType
}

export interface SavedReport {
  id: string
  name: string
  widgets: DashboardWidget[]
  createdAt: string
}

export const WIDGET_LABELS: Record<WidgetType, string> = {
  dau: 'DAU',
  conversion: 'Conversion',
  churn: 'Churn',
  retention: 'Retention',
  funnel: 'User Journey',
}
