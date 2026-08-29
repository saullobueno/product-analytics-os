import { describe, expect, it } from 'vitest'
import { releaseEvent } from './constants'
import { getDataset } from './index'
import {
  dailyConversionSeries,
  detectConversionAnomalies,
  funnelStepDropOff,
  percentChange,
  previousRange,
  rangeFromPreset,
  type FunnelTotals,
} from './selectors'

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

describe('dailyConversionSeries', () => {
  it('cobre todos os dias do dataset em ordem', () => {
    const dataset = getDataset()
    const series = dailyConversionSeries(dataset)
    expect(series.length).toBe(dataset.dailyMetrics.length)
    for (let i = 1; i < series.length; i++) {
      expect(series[i].date >= series[i - 1].date).toBe(true)
    }
  })
})

describe('detectConversionAnomalies', () => {
  it('sinaliza a janela da regressão do Android como anomalia', () => {
    const dataset = getDataset()
    const release = releaseEvent()
    const anomalies = detectConversionAnomalies(dataset, 'android')

    expect(anomalies.length).toBeGreaterThan(0)
    expect(anomalies.every((a) => a.date >= release.date)).toBe(true)
    expect(anomalies.every((a) => a.deviationPct < 0)).toBe(true)
    expect(
      anomalies.every((a) =>
        (['warning', 'serious', 'critical'] as const).includes(a.severity),
      ),
    ).toBe(true)
  })

  it('não sinaliza anomalias quando a conversão é idêntica todo dia', () => {
    const flatFunnelRow = (date: string) => ({
      date,
      device: 'android' as const,
      counts: { landing: 100, signup: 80, onboarding: 60, activated: 30 },
    })
    const fakeDataset = {
      funnel: ['2026-01-01', '2026-01-02', '2026-01-03'].map(flatFunnelRow),
    } as Parameters<typeof detectConversionAnomalies>[0]

    expect(detectConversionAnomalies(fakeDataset)).toEqual([])
  })
})
