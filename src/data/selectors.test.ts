import { describe, expect, it } from 'vitest'
import {
  funnelStepDropOff,
  percentChange,
  previousRange,
  rangeFromPreset,
  type FunnelTotals,
} from './selectors'
import { getDataset } from './index'

describe('rangeFromPreset', () => {
  it('calcula 7d/30d/90d terminando no fim do dataset', () => {
    const dataset = getDataset()
    const seven = rangeFromPreset(dataset, '7d')
    const thirty = rangeFromPreset(dataset, '30d')
    const ninety = rangeFromPreset(dataset, '90d')

    expect(seven.end).toBe(dataset.dateRange.end)
    expect(thirty.end).toBe(dataset.dateRange.end)
    expect(ninety.start).toBe(dataset.dateRange.start)
    expect(seven.start >= thirty.start).toBe(true)
    expect(thirty.start >= ninety.start).toBe(true)
  })
})

describe('previousRange', () => {
  it('devolve um período de mesma duração, imediatamente anterior', () => {
    const range = { start: '2026-08-01', end: '2026-08-07' }
    const previous = previousRange(range)
    expect(previous).toEqual({ start: '2026-07-25', end: '2026-07-31' })
  })
})

describe('percentChange', () => {
  it('calcula variação percentual normalmente', () => {
    expect(percentChange(110, 100)).toBeCloseTo(10)
    expect(percentChange(90, 100)).toBeCloseTo(-10)
  })

  it('retorna null quando não há base válida para comparar', () => {
    expect(percentChange(50, 0)).toBeNull()
    expect(percentChange(50, -5)).toBeNull()
  })
})

describe('funnelStepDropOff', () => {
  it('retainedFromLandingRate é 100 no landing e decresce monotonicamente', () => {
    const totals: FunnelTotals = {
      counts: { landing: 1000, signup: 500, onboarding: 300, activated: 150 },
      conversionRate: 15,
    }
    const steps = funnelStepDropOff(totals)
    expect(steps[0].retainedFromLandingRate).toBe(100)
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].retainedFromLandingRate).toBeLessThanOrEqual(
        steps[i - 1].retainedFromLandingRate,
      )
    }
    expect(steps.at(-1)?.retainedFromLandingRate).toBeCloseTo(15)
  })
})
