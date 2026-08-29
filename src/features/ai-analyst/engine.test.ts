import { describe, expect, it } from 'vitest'
import { getDataset } from '@/data'
import { answerQuestion, computeConfidence, matchMetric } from './engine'
import type { InsightReport } from './types'

describe('matchMetric', () => {
  it('reconhece perguntas sobre conversão, com ou sem acento', () => {
    expect(matchMetric('Por que a conversão caiu esta semana?')).toBe(
      'conversion',
    )
    expect(matchMetric('why did conversion drop')).toBe('conversion')
  })

  it('reconhece perguntas sobre churn, retenção e DAU', () => {
    expect(matchMetric('o churn subiu?')).toBe('churn')
    expect(matchMetric('a retenção está caindo?')).toBe('retention')
    expect(matchMetric('como está o DAU?')).toBe('dau')
  })

  it('retorna null para perguntas não reconhecidas', () => {
    expect(matchMetric('qual é a cor do céu?')).toBeNull()
  })
})

describe('computeConfidence', () => {
  it('cresce com magnitude, release alinhado e concentração', () => {
    const base = computeConfidence({
      magnitudePct: 5,
      releaseAligned: false,
      concentrated: false,
    })
    const withRelease = computeConfidence({
      magnitudePct: 5,
      releaseAligned: true,
      concentrated: false,
    })
    const withBoth = computeConfidence({
      magnitudePct: 5,
      releaseAligned: true,
      concentrated: true,
    })
    expect(withRelease).toBeGreaterThan(base)
    expect(withBoth).toBeGreaterThan(withRelease)
  })

  it('fica sempre entre 30 e 96', () => {
    expect(
      computeConfidence({
        magnitudePct: 0,
        releaseAligned: false,
        concentrated: false,
      }),
    ).toBeGreaterThanOrEqual(30)
    expect(
      computeConfidence({
        magnitudePct: 1000,
        releaseAligned: true,
        concentrated: true,
      }),
    ).toBeLessThanOrEqual(96)
  })
})

describe('answerQuestion', () => {
  it('para uma pergunta não reconhecida, retorna recognized: false', () => {
    const dataset = getDataset()
    const answer = answerQuestion(dataset, 'qual é a cor do céu?')
    expect(answer.recognized).toBe(false)
  })

  it('a análise de conversão aponta a regressão real do Android/onboarding/release', () => {
    const dataset = getDataset()
    const answer = answerQuestion(
      dataset,
      'Por que a conversão caiu esta semana?',
    ) as InsightReport

    expect(answer.metric).toBe('conversion')
    expect(answer.direction).toBe('down')
    expect(answer.headline).toMatch(/conversion decreased/i)
    expect(answer.evidence.join(' ')).toMatch(/android/i)
    expect(answer.evidence.join(' ')).toMatch(/onboarding/i)
    expect(answer.evidence.join(' ')).toMatch(/release 2\.4\.0/i)
    expect(answer.primaryFactor).toBe('Mobile onboarding')
    expect(answer.confidence).toBeGreaterThan(50)
  })

  it('responde perguntas sobre churn, retenção e DAU com um InsightReport válido', () => {
    const dataset = getDataset()

    for (const question of [
      'o churn subiu?',
      'a retenção caiu?',
      'como está o DAU?',
    ]) {
      const answer = answerQuestion(dataset, question) as InsightReport
      expect(answer.recognized).not.toBe(false)
      expect(answer.headline.length).toBeGreaterThan(0)
      expect(answer.evidence.length).toBeGreaterThan(0)
      expect(answer.confidence).toBeGreaterThanOrEqual(30)
      expect(answer.confidence).toBeLessThanOrEqual(96)
    }
  })
})
