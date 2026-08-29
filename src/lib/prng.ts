/**
 * PRNG determinístico (mulberry32) — mesma seed produz sempre a mesma
 * sequência, entre reloads e em testes. Não é criptográfico; serve só
 * para gerar o dataset sintético do produto (ver ADR 0002).
 */
export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = () => number

/** Inteiro em [min, max]. */
export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

/** Float em [min, max). */
export function randFloat(rng: Rng, min: number, max: number): number {
  return rng() * (max - min) + min
}

/** Ruído gaussiano aproximado via soma de uniformes (irwin-hall). */
export function randGaussian(rng: Rng, mean = 0, stdDev = 1): number {
  let sum = 0
  for (let i = 0; i < 6; i++) sum += rng()
  return mean + (sum - 3) * stdDev
}

export function choice<T>(rng: Rng, items: readonly T[]): T {
  return items[randInt(rng, 0, items.length - 1)]
}

export function weightedChoice<T>(
  rng: Rng,
  items: readonly { value: T; weight: number }[],
): T {
  const total = items.reduce((acc, i) => acc + i.weight, 0)
  let roll = rng() * total
  for (const item of items) {
    roll -= item.weight
    if (roll <= 0) return item.value
  }
  return items[items.length - 1].value
}
