import { format } from 'date-fns'
import { mulberry32 } from '@/lib/prng'
import {
  SEED,
  datasetEndDate,
  datasetStartDate,
  releaseEvent,
} from './constants'
import { generateCohorts } from './generateCohorts'
import { generateDailyMetrics } from './generateDailyMetrics'
import { generateFunnel } from './generateFunnel'
import { generateRecentEvents } from './generateRecentEvents'
import type { Dataset } from './types'

let cached: Dataset | null = null

/**
 * Dataset sintético completo, memoizado em módulo. Determinístico
 * para uma mesma seed e uma mesma data de sistema (o dataset é uma
 * janela móvel de TOTAL_DAYS terminando "hoje" — ver ADR 0002/0003).
 */
export function getDataset(): Dataset {
  if (cached) return cached

  const rng = mulberry32(SEED)
  const funnel = generateFunnel(rng)
  const dailyMetrics = generateDailyMetrics(rng, funnel)
  const cohorts = generateCohorts(rng, dailyMetrics)
  const recentEvents = generateRecentEvents(rng)

  cached = {
    seed: SEED,
    dateRange: {
      start: format(datasetStartDate(), 'yyyy-MM-dd'),
      end: format(datasetEndDate(), 'yyyy-MM-dd'),
    },
    releases: [releaseEvent()],
    dailyMetrics,
    funnel,
    cohorts,
    recentEvents,
  }

  return cached
}

/** Só para testes: força a regeneração do dataset memoizado. */
export function resetDatasetCache(): void {
  cached = null
}

export type * from './types'
