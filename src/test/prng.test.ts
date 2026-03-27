import { describe, it, expect } from 'vitest'
import { PRNG, seedFromFloor } from '../utils/prng'

describe('PRNG', () => {
  it('next() returns values in [0, 1)', () => {
    const prng = new PRNG(42)
    for (let i = 0; i < 100; i++) {
      const v = prng.next()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('same seed produces same sequence', () => {
    const a = new PRNG(12345)
    const b = new PRNG(12345)
    for (let i = 0; i < 10; i++) {
      expect(a.next()).toBe(b.next())
    }
  })

  it('different seeds produce different sequences', () => {
    const a = new PRNG(1)
    const b = new PRNG(2)
    const seqA = Array.from({ length: 5 }, () => a.next())
    const seqB = Array.from({ length: 5 }, () => b.next())
    expect(seqA).not.toEqual(seqB)
  })

  it('nextInt returns integer in [min, max]', () => {
    const prng = new PRNG(999)
    for (let i = 0; i < 50; i++) {
      const v = prng.nextInt(1, 10)
      expect(Number.isInteger(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(10)
    }
  })

  it('pick selects an element from the array', () => {
    const prng = new PRNG(7)
    const arr = ['a', 'b', 'c', 'd']
    const picked = prng.pick(arr)
    expect(arr).toContain(picked)
  })

  it('nextBool returns true or false with 0.5 probability', () => {
    const prng = new PRNG(123)
    const results = Array.from({ length: 100 }, () => prng.nextBool(0.5))
    expect(results.some(v => v === true)).toBe(true)
    expect(results.some(v => v === false)).toBe(true)
  })

  it('nextBool always returns true with probability 1.0', () => {
    const prng = new PRNG(42)
    const results = Array.from({ length: 10 }, () => prng.nextBool(1.0))
    expect(results.every(v => v === true)).toBe(true)
  })

  it('nextBool always returns false with probability 0.0', () => {
    const prng = new PRNG(42)
    const results = Array.from({ length: 10 }, () => prng.nextBool(0.0))
    expect(results.every(v => v === false)).toBe(true)
  })
})

describe('seedFromFloor', () => {
  it('returns a number', () => {
    expect(typeof seedFromFloor(1, 1)).toBe('number')
  })

  it('same floor + killCount = same seed', () => {
    expect(seedFromFloor(5, 10)).toBe(seedFromFloor(5, 10))
  })

  it('different floors = different seeds', () => {
    expect(seedFromFloor(1, 1)).not.toBe(seedFromFloor(2, 1))
  })

  it('different killCounts = different seeds', () => {
    expect(seedFromFloor(1, 1)).not.toBe(seedFromFloor(1, 2))
  })
})
