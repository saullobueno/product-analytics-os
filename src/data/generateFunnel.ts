import { eachDayOfInterval, format } from 'date-fns'
import { randFloat, type Rng } from '@/lib/prng'
import {
  DEVICE_SEGMENTS,
  DEVICE_SHARE,
  datasetEndDate,
  datasetStartDate,
  releaseEvent,
} from './constants'
import type { DeviceSegment, FunnelDailyBreakdown } from './types'

interface DeviceConversionRates {
  landingToSignup: number
  signupToOnboarding: number
  onboardingToActivated: number
}

const BASE_RATES: Record<DeviceSegment, DeviceConversionRates> = {
  android: {
    landingToSignup: 0.28,
    signupToOnboarding: 0.55,
    onboardingToActivated: 0.45,
  },
  ios: {
    landingToSignup: 0.32,
    signupToOnboarding: 0.6,
    onboardingToActivated: 0.58,
  },
  web: {
    landingToSignup: 0.15,
    signupToOnboarding: 0.4,
    onboardingToActivated: 0.35,
  },
}

const BASE_DAILY_LANDING = 40_000

/**
 * A partir do release 2.4.0, o abandono no passo "onboarding" do
 * Android cresce 50% (ver ADR 0003) — regressão real embutida no
 * dataset para o AI Analyst encontrar, não só texto decorativo.
 */
const ANDROID_ONBOARDING_ABANDONMENT_MULTIPLIER = 1.5

function isWeekend(dayOfWeek: number): boolean {
  return dayOfWeek === 0 || dayOfWeek === 6
}

function landingVisitorsForDay(
  rng: Rng,
  dayIndex: number,
  totalDays: number,
  dayOfWeek: number,
): number {
  const trend = 1 + (dayIndex / totalDays) * 0.08
  const weekendFactor = isWeekend(dayOfWeek) ? 0.85 : 1
  const noise = randFloat(rng, 0.94, 1.06)
  return Math.round(BASE_DAILY_LANDING * trend * weekendFactor * noise)
}

export function generateFunnel(rng: Rng): FunnelDailyBreakdown[] {
  const days = eachDayOfInterval({
    start: datasetStartDate(),
    end: datasetEndDate(),
  })
  const releaseDate = releaseEvent().date
  const rows: FunnelDailyBreakdown[] = []

  days.forEach((day, index) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const totalLanding = landingVisitorsForDay(
      rng,
      index,
      days.length,
      day.getDay(),
    )

    for (const device of DEVICE_SEGMENTS) {
      const landing = Math.round(
        totalLanding * DEVICE_SHARE[device] * randFloat(rng, 0.97, 1.03),
      )
      const rates = { ...BASE_RATES[device] }

      if (device === 'android' && dateStr >= releaseDate) {
        const abandonment = 1 - rates.onboardingToActivated
        rates.onboardingToActivated =
          1 - abandonment * ANDROID_ONBOARDING_ABANDONMENT_MULTIPLIER
      }

      const signup = Math.round(
        landing * rates.landingToSignup * randFloat(rng, 0.96, 1.04),
      )
      const onboarding = Math.round(
        signup * rates.signupToOnboarding * randFloat(rng, 0.96, 1.04),
      )
      const activated = Math.round(
        onboarding * rates.onboardingToActivated * randFloat(rng, 0.96, 1.04),
      )

      rows.push({
        date: dateStr,
        device,
        counts: { landing, signup, onboarding, activated },
      })
    }
  })

  return rows
}
