import { eachDayOfInterval, format } from 'date-fns'
import { randFloat, type Rng } from '@/lib/prng'
import { datasetEndDate, datasetStartDate } from './constants'
import type { DailyMetrics, FunnelDailyBreakdown } from './types'

const BASE_DAU = 178_000

function isWeekend(dayOfWeek: number): boolean {
  return dayOfWeek === 0 || dayOfWeek === 6
}

function dauForDay(
  rng: Rng,
  dayIndex: number,
  totalDays: number,
  dayOfWeek: number,
): number {
  const trend = 1 + (dayIndex / totalDays) * 0.03
  const weekendFactor = isWeekend(dayOfWeek) ? 0.88 : 1
  const noise = randFloat(rng, 0.97, 1.03)
  return Math.round(BASE_DAU * trend * weekendFactor * noise)
}

function sumActivatedByDate(
  funnel: FunnelDailyBreakdown[],
): Map<string, number> {
  const totals = new Map<string, number>()
  for (const row of funnel) {
    totals.set(row.date, (totals.get(row.date) ?? 0) + row.counts.activated)
  }
  return totals
}

export function generateDailyMetrics(
  rng: Rng,
  funnel: FunnelDailyBreakdown[],
): DailyMetrics[] {
  const days = eachDayOfInterval({
    start: datasetStartDate(),
    end: datasetEndDate(),
  })
  const activatedByDate = sumActivatedByDate(funnel)

  return days.map((day, index) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const dau = dauForDay(rng, index, days.length, day.getDay())
    return {
      date: dateStr,
      dau,
      newUsers: activatedByDate.get(dateStr) ?? 0,
      churnedUsers: Math.round(dau * randFloat(rng, 0.018, 0.03)),
      sessions: Math.round(dau * randFloat(rng, 1.4, 1.9)),
    }
  })
}
