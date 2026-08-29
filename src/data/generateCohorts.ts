import {
  addDays,
  differenceInCalendarWeeks,
  eachDayOfInterval,
  format,
  startOfWeek,
} from 'date-fns'
import { randFloat, type Rng } from '@/lib/prng'
import { datasetEndDate, datasetStartDate } from './constants'
import type { CohortRetentionRow, DailyMetrics } from './types'

const MAX_WEEKS_TRACKED = 10

function retentionCurve(rng: Rng, weeksElapsed: number): number[] {
  const curve = [100]
  let current = 45 + randFloat(rng, -3, 3)
  for (let week = 1; week <= weeksElapsed; week++) {
    curve.push(Math.max(6, Math.round(current)))
    current *= 0.78 + randFloat(rng, -0.03, 0.03)
  }
  return curve
}

export function generateCohorts(
  rng: Rng,
  dailyMetrics: DailyMetrics[],
): CohortRetentionRow[] {
  const newUsersByDate = new Map(dailyMetrics.map((m) => [m.date, m.newUsers]))
  const end = datasetEndDate()
  const firstCohortStart = startOfWeek(datasetStartDate(), { weekStartsOn: 1 })

  const cohortStarts: Date[] = []
  for (
    let cursor = firstCohortStart;
    cursor <= end;
    cursor = addDays(cursor, 7)
  ) {
    cohortStarts.push(cursor)
  }

  return cohortStarts.map((cohortStart) => {
    const weekDays = eachDayOfInterval({
      start: cohortStart,
      end: addDays(cohortStart, 6),
    }).filter((day) => day <= end)

    const cohortSize = weekDays.reduce(
      (sum, day) => sum + (newUsersByDate.get(format(day, 'yyyy-MM-dd')) ?? 0),
      0,
    )

    const weeksElapsed = Math.min(
      MAX_WEEKS_TRACKED,
      Math.max(0, differenceInCalendarWeeks(end, cohortStart)),
    )

    return {
      cohortWeekStart: format(cohortStart, 'yyyy-MM-dd'),
      cohortSize,
      retentionByWeek: retentionCurve(rng, weeksElapsed),
    }
  })
}
