// Web Audio API procedural SFX — no audio files required

let audioCtx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

export function setMuted(m: boolean): void {
  muted = m
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue = 0.3,
  decayTime?: number
): void {
  if (muted) return
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(gainValue, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + (decayTime ?? duration)
    )
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch { /* audio may fail in some environments */ }
}

export const sfx = {
  attack(): void {
    // Sword clang: quick metallic hit
    playTone(440, 0.08, 'sawtooth', 0.2, 0.06)
    playTone(660, 0.06, 'square', 0.1, 0.04)
  },

  enemyAttack(): void {
    // Thud
    playTone(150, 0.1, 'sine', 0.25, 0.08)
  },

  itemDrop(rarity: string): void {
    switch (rarity) {
      case 'common':    playTone(440, 0.15, 'sine', 0.15); break
      case 'uncommon':  playTone(523, 0.2, 'sine', 0.2); break
      case 'rare':
        playTone(587, 0.15, 'sine', 0.2)
        setTimeout(() => playTone(784, 0.2, 'sine', 0.2), 80)
        break
      case 'epic':
        playTone(523, 0.1, 'sine', 0.25)
        setTimeout(() => playTone(659, 0.1, 'sine', 0.25), 80)
        setTimeout(() => playTone(784, 0.25, 'sine', 0.3), 160)
        break
      case 'legendary':
        // Fanfare
        [523, 659, 784, 1047].forEach((f, i) => {
          setTimeout(() => playTone(f, 0.3, 'sine', 0.35), i * 100)
        })
        break
    }
  },

  levelUp(): void {
    // Ascending chime
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 'sine', 0.3), i * 80)
    })
  },

  goldPickup(): void {
    playTone(880, 0.08, 'sine', 0.1, 0.06)
  },

  bossAppear(): void {
    // Low dramatic hit
    playTone(80, 0.4, 'sawtooth', 0.4, 0.35)
    setTimeout(() => playTone(60, 0.5, 'square', 0.3, 0.45), 100)
  },

  victory(): void {
    [523, 523, 659, 784].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.25, 'sine', 0.3), i * 120)
    })
  },

  prestige(): void {
    // Dramatic ascending fanfare
    [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.4, 'sine', 0.4), i * 120)
    })
  },

  click(): void {
    playTone(440, 0.04, 'sine', 0.1, 0.03)
  },

  achievementUnlock(): void {
    playTone(784, 0.15, 'sine', 0.25)
    setTimeout(() => playTone(1047, 0.25, 'sine', 0.25), 100)
  },

  abilityFireball(): void {
    // Whoosh + burst
    playTone(200, 0.1, 'sawtooth', 0.3, 0.08)
    setTimeout(() => playTone(400, 0.15, 'sine', 0.35, 0.12), 50)
    setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.3, 0.18), 100)
  },

  abilityCleave(): void {
    playTone(220, 0.12, 'sawtooth', 0.35, 0.1)
    playTone(330, 0.12, 'sawtooth', 0.25, 0.1)
  },

  abilitySmite(): void {
    playTone(880, 0.08, 'sine', 0.3, 0.06)
    setTimeout(() => playTone(1100, 0.2, 'sine', 0.35, 0.18), 60)
  },

  abilityBackstab(): void {
    playTone(660, 0.06, 'sawtooth', 0.25, 0.05)
    setTimeout(() => playTone(1320, 0.1, 'square', 0.2, 0.08), 40)
  },
}
