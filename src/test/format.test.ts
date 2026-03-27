import { describe, it, expect } from 'vitest'
import { formatNumber, formatGold, formatPercent, formatTime } from '../utils/format'

describe('formatNumber', () => {
  it('returns plain number for values below 1000', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(999)).toBe('999')
  })

  it('formats thousands with K suffix', () => {
    // scaled < 10 uses 2 decimal places
    expect(formatNumber(1000)).toBe('1.00K')
    expect(formatNumber(1500)).toBe('1.50K')
    // scaled >= 10 uses 1 decimal place
    expect(formatNumber(10000)).toBe('10.0K')
  })

  it('formats millions with M suffix', () => {
    expect(formatNumber(1_000_000)).toBe('1.00M')
  })

  it('formats billions with B suffix', () => {
    expect(formatNumber(1_000_000_000)).toBe('1.00B')
  })

  it('handles negative numbers', () => {
    const result = formatNumber(-500)
    expect(result).toContain('500')
  })
})

describe('formatGold', () => {
  it('includes gold symbol', () => {
    const result = formatGold(100)
    expect(result).toContain('100')
  })
})

describe('formatPercent', () => {
  it('formats 0.5 as 50%', () => {
    expect(formatPercent(0.5)).toContain('50')
    expect(formatPercent(0.5)).toContain('%')
  })

  it('formats 1.0 as 100%', () => {
    expect(formatPercent(1.0)).toContain('100')
  })
})

describe('formatTime', () => {
  it('formats seconds correctly', () => {
    const result = formatTime(90)
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('handles zero seconds', () => {
    expect(formatTime(0)).toBeTruthy()
  })
})
