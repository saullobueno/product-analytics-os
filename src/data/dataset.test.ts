import { beforeEach, describe, expect, it } from 'vitest'
import { releaseEvent } from './constants'
import { getDataset, resetDatasetCache } from './index'
import {
  averageWeek1Retention,
  conversionRateByDevice,
  funnelStepDropOff,
  funnelTotals,
} from './selectors'

beforeEach(() => {
  resetDatasetCache()
})

describe('getDataset', () => {
  it('é determinístico para a mesma seed/data', () => {
    // recentEvents simula um feed "ao vivo" ancorado em Date.now() e
    // não precisa ser byte-idêntico entre duas chamadas no mesmo teste
    // (ver generateRecentEvents) — o restante do dataset (a parte
    // analítica) deve ser 100% reprodutível.
    const { recentEvents: _a, ...a } = getDataset()
    resetDatasetCache()
    const { recentEvents: _b, ...b } = getDataset()
    expect(a).toEqual(b)
  })

  it('cobre a janela de datas esperada', () => {
    const dataset = getDataset()
    expect(dataset.dailyMetrics.length).toBe(90)
    expect(dataset.dailyMetrics[0].date).toBe(dataset.dateRange.start)
    expect(dataset.dailyMetrics.at(-1)?.date).toBe(dataset.dateRange.end)
  })

  it('nunca produz métricas negativas', () => {
    const dataset = getDataset()
    for (const m of dataset.dailyMetrics) {
      expect(m.dau).toBeGreaterThan(0)
      expect(m.newUsers).toBeGreaterThanOrEqual(0)
      expect(m.churnedUsers).toBeGreaterThanOrEqual(0)
      expect(m.sessions).toBeGreaterThan(0)
    }
  })

  it('o funil é monotonicamente decrescente em cada dia/device', () => {
    const dataset = getDataset()
    for (const row of dataset.funnel) {
      expect(row.counts.landing).toBeGreaterThanOrEqual(row.counts.signup)
      expect(row.counts.signup).toBeGreaterThanOrEqual(row.counts.onboarding)
      expect(row.counts.onboarding).toBeGreaterThanOrEqual(row.counts.activated)
    }
  })

  it('embute uma regressão real de conversão mobile após o release', () => {
    const dataset = getDataset()
    const release = releaseEvent()

    const before = conversionRateByDevice(dataset, 'android', {
      start: dataset.dateRange.start,
      end: release.date,
    })
    const after = conversionRateByDevice(dataset, 'android', {
      start: release.date,
      end: dataset.dateRange.end,
    })

    expect(after).toBeLessThan(before * 0.85)
  })

  it('não regride a conversão de devices não afetados pelo release', () => {
    const dataset = getDataset()
    const release = releaseEvent()

    const before = conversionRateByDevice(dataset, 'ios', {
      start: dataset.dateRange.start,
      end: release.date,
    })
    const after = conversionRateByDevice(dataset, 'ios', {
      start: release.date,
      end: dataset.dateRange.end,
    })

    expect(after).toBeGreaterThan(before * 0.85)
  })

  it('retenção dos coortes decai ao longo das semanas', () => {
    const dataset = getDataset()
    const cohort = dataset.cohorts.find((c) => c.retentionByWeek.length >= 4)
    expect(cohort).toBeDefined()
    const curve = cohort!.retentionByWeek
    expect(curve[0]).toBe(100)
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i]).toBeLessThanOrEqual(curve[i - 1])
    }
  })

  it('retenção média de semana 1 fica numa faixa plausível', () => {
    const dataset = getDataset()
    const retention = averageWeek1Retention(dataset)
    expect(retention).toBeGreaterThan(20)
    expect(retention).toBeLessThan(70)
  })

  it('gera eventos recentes ordenados do mais novo para o mais antigo', () => {
    const dataset = getDataset()
    expect(dataset.recentEvents.length).toBeGreaterThan(0)
    for (let i = 1; i < dataset.recentEvents.length; i++) {
      expect(dataset.recentEvents[i - 1].timestamp).toBeGreaterThanOrEqual(
        dataset.recentEvents[i].timestamp,
      )
    }
  })
})

describe('selectors', () => {
  it('funnelStepDropOff calcula quedas percentuais coerentes com os counts', () => {
    const dataset = getDataset()
    const totals = funnelTotals(dataset)
    const steps = funnelStepDropOff(totals)

    expect(steps[0].dropOffRate).toBe(0)
    for (const step of steps) {
      expect(step.dropOffRate).toBeGreaterThanOrEqual(0)
      expect(step.dropOffRate).toBeLessThanOrEqual(1)
    }
  })
})
