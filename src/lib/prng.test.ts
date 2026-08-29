import { describe, expect, it } from 'vitest'
import { choice, mulberry32, randFloat, randInt } from './prng'

describe('mulberry32', () => {
  it('produz a mesma sequência para a mesma seed', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    const seqA = Array.from({ length: 20 }, () => a())
    const seqB = Array.from({ length: 20 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('produz sequências diferentes para seeds diferentes', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    expect(a()).not.toBe(b())
  })

  it('gera valores em [0, 1)', () => {
    const rng = mulberry32(7)
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('randInt', () => {
  it('respeita os limites inclusivos', () => {
    const rng = mulberry32(1)
    for (let i = 0; i < 500; i++) {
      const v = randInt(rng, 3, 7)
      expect(v).toBeGreaterThanOrEqual(3)
      expect(v).toBeLessThanOrEqual(7)
    }
  })
})

describe('randFloat', () => {
  it('respeita o intervalo [min, max)', () => {
    const rng = mulberry32(1)
    for (let i = 0; i < 500; i++) {
      const v = randFloat(rng, 1, 2)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThan(2)
    }
  })
})

describe('choice', () => {
  it('sempre retorna um item da lista', () => {
    const rng = mulberry32(1)
    const items = ['a', 'b', 'c'] as const
    for (let i = 0; i < 50; i++) {
      expect(items).toContain(choice(rng, items))
    }
  })
})
