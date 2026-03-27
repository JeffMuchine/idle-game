// Number formatting utilities for idle game display

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']

export function formatNumber(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '0'
  if (n < 0) return '-' + formatNumber(-n)
  if (n < 1000) return Math.floor(n).toString()

  const tier = Math.floor(Math.log10(Math.abs(n)) / 3)
  if (tier < SUFFIXES.length) {
    const suffix = SUFFIXES[tier]
    const scaled = n / Math.pow(1000, tier)
    return scaled.toFixed(scaled < 10 ? 2 : 1) + suffix
  }
  // Fallback to scientific notation
  const exp = Math.floor(Math.log10(Math.abs(n)))
  const mantissa = n / Math.pow(10, exp)
  return mantissa.toFixed(2) + 'e' + exp
}

export function formatGold(n: number): string {
  return formatNumber(n) + 'g'
}

export function formatPercent(n: number, decimals = 1): string {
  return (n * 100).toFixed(decimals) + '%'
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return Math.floor(seconds) + 's'
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}m ${s}s`
  }
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

export function formatDps(dps: number): string {
  return formatNumber(dps) + '/s'
}
