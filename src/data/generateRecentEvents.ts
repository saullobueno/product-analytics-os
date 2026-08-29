import { choice, randInt, type Rng } from '@/lib/prng'
import { CHANNELS, DEVICE_SEGMENTS } from './constants'
import type { RawEvent } from './types'

const EVENT_NAMES = [
  'page_view',
  'signup_started',
  'signup_completed',
  'onboarding_step_viewed',
  'onboarding_step_completed',
  'feature_used:dashboard',
  'feature_used:funnel',
  'feature_used:retention',
  'session_start',
  'session_end',
] as const

const RECENT_EVENT_COUNT = 150
const MAX_MINUTES_AGO = 45

export function generateRecentEvents(rng: Rng): RawEvent[] {
  const now = Date.now()
  const events: RawEvent[] = []

  for (let i = 0; i < RECENT_EVENT_COUNT; i++) {
    const minutesAgo = randInt(rng, 0, MAX_MINUTES_AGO)
    events.push({
      id: `evt_${i.toString(36)}`,
      timestamp: now - minutesAgo * 60_000,
      name: choice(rng, EVENT_NAMES),
      device: choice(rng, DEVICE_SEGMENTS),
      channel: choice(rng, CHANNELS),
    })
  }

  return events.sort((a, b) => b.timestamp - a.timestamp)
}
