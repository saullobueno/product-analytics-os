export type DeviceSegment = 'android' | 'ios' | 'web'
export type Channel = 'organic' | 'paid' | 'referral' | 'social'
export type FunnelStepId = 'landing' | 'signup' | 'onboarding' | 'activated'

export interface FunnelStepDefinition {
  id: FunnelStepId
  label: string
}

export interface DailyMetrics {
  date: string
  dau: number
  newUsers: number
  churnedUsers: number
  sessions: number
}

export interface FunnelDailyBreakdown {
  date: string
  device: DeviceSegment
  counts: Record<FunnelStepId, number>
}

export interface CohortRetentionRow {
  cohortWeekStart: string
  cohortSize: number
  /** índice 0 = semana 0 (100%), índice n = % retida após n semanas */
  retentionByWeek: number[]
}

export interface ReleaseEvent {
  version: string
  date: string
  notes: string
}

export interface RawEvent {
  id: string
  timestamp: number
  name: string
  device: DeviceSegment
  channel: Channel
}

export interface Dataset {
  seed: number
  dateRange: { start: string; end: string }
  releases: ReleaseEvent[]
  dailyMetrics: DailyMetrics[]
  funnel: FunnelDailyBreakdown[]
  cohorts: CohortRetentionRow[]
  recentEvents: RawEvent[]
}
