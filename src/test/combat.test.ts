import { describe, it, expect } from 'vitest'
import {
  getEffectiveStats,
  calculateHeroAttack,
  calculateMonsterAttack,
  getAttackIntervalMs,
  xpRequired,
  calculateIdleDPS,
  getGoldMultiplierFromSoul,
  getXpMultiplierFromSoul,
  getOfflineRate,
  getStartFloor,
} from '../engine/combat'
import { PRNG } from '../utils/prng'
import type { Hero, Monster } from '../types'

// ---- Fixtures ----

function makeHero(overrides: Partial<Hero> = {}): Hero {
  return {
    name: 'Test',
    heroClass: 'warrior',
    level: 1,
    xp: 0,
    xpRequired: 100,
    baseStats: { attack: 15, defense: 10, speed: 20, critChance: 0.05, critDamage: 2.0, maxHp: 120 },
    equipment: {},
    skillsUnlocked: [],
    abilityLastUsed: {},
    ...overrides,
  }
}

function makeMonster(overrides: Partial<Monster> = {}): Monster {
  return {
    id: 'goblin',
    dungeonIndex: 0,
    name: 'Goblin',
    flavorText: 'test',
    hp: 100,
    maxHp: 100,
    attack: 10,
    xpReward: 50,
    goldReward: 5,
    isBoss: false,
    ...overrides,
  }
}

// ---- getEffectiveStats ----

describe('getEffectiveStats', () => {
  it('returns base stats for hero with no equipment or skills', () => {
    const hero = makeHero()
    const stats = getEffectiveStats(hero)
    expect(stats.attack).toBe(15)
    expect(stats.defense).toBe(10)
    expect(stats.maxHp).toBe(120)
    expect(stats.critChance).toBe(0.05)
  })

  it('adds equipment bonuses to base stats', () => {
    const hero = makeHero({
      equipment: {
        weapon: {
          id: 'sword1', slot: 'weapon', rarity: 'common', name: 'Sword', flavorText: '',
          attack: 10, defense: 0, hp: 0, critChance: 0, speed: 0, level: 1,
        }
      }
    })
    const stats = getEffectiveStats(hero)
    expect(stats.attack).toBe(25)  // 15 base + 10 from sword
  })

  it('caps critChance at 0.95', () => {
    const hero = makeHero({
      equipment: {
        ring: {
          id: 'r1', slot: 'ring', rarity: 'legendary', name: 'Crit Ring', flavorText: '',
          attack: 0, defense: 0, hp: 0, critChance: 0.99, speed: 0, level: 50,
        }
      }
    })
    const stats = getEffectiveStats(hero)
    expect(stats.critChance).toBeLessThanOrEqual(0.95)
  })

  it('caps speed at 200', () => {
    const hero = makeHero({
      equipment: {
        amulet: {
          id: 'a1', slot: 'amulet', rarity: 'legendary', name: 'Speed Amulet', flavorText: '',
          attack: 0, defense: 0, hp: 0, critChance: 0, speed: 300, level: 50,
        }
      }
    })
    const stats = getEffectiveStats(hero)
    expect(stats.speed).toBe(200)
  })
})

// ---- getAttackIntervalMs ----

describe('getAttackIntervalMs', () => {
  it('returns 1000ms for zero speed', () => {
    const hero = makeHero({ baseStats: { attack: 15, defense: 10, speed: 0, critChance: 0.05, critDamage: 2.0, maxHp: 120 } })
    const stats = getEffectiveStats(hero)
    expect(getAttackIntervalMs(stats)).toBe(1000)
  })

  it('returns 800ms for speed=40 (warrior base 20 with no items)', () => {
    const hero = makeHero()
    const stats = getEffectiveStats(hero)
    // speed=20 → 1000 - 20*5 = 900ms
    expect(getAttackIntervalMs(stats)).toBe(900)
  })

  it('never goes below 200ms (minimum interval)', () => {
    const hero = makeHero({
      baseStats: { attack: 15, defense: 10, speed: 200, critChance: 0.05, critDamage: 2.0, maxHp: 120 }
    })
    const stats = getEffectiveStats(hero)
    expect(getAttackIntervalMs(stats)).toBe(200)
  })

  it('speed stat meaningfully differentiates rogue vs warrior', () => {
    const warrior = makeHero({ heroClass: 'warrior' })
    const rogue   = makeHero({ heroClass: 'rogue', baseStats: { attack: 12, defense: 5, speed: 50, critChance: 0.20, critDamage: 3.0, maxHp: 85 } })
    const wStats = getEffectiveStats(warrior)
    const rStats = getEffectiveStats(rogue)
    expect(getAttackIntervalMs(rStats)).toBeLessThan(getAttackIntervalMs(wStats))
  })
})

// ---- calculateHeroAttack ----

describe('calculateHeroAttack', () => {
  it('deals at least 1 damage', () => {
    const hero = makeHero()
    const monster = makeMonster()
    const stats = getEffectiveStats(hero)
    const prng = new PRNG(12345)
    const result = calculateHeroAttack(hero, monster, stats, Date.now(), 0, prng)
    expect(result.damage).toBeGreaterThanOrEqual(1)
  })

  it('crit deals critDamage multiplier more than normal', () => {
    const hero = makeHero({ baseStats: { attack: 100, defense: 0, speed: 0, critChance: 1.0, critDamage: 2.0, maxHp: 100 } })
    const monster = makeMonster()
    const stats = getEffectiveStats(hero)
    const prng = new PRNG(1)  // critChance=1.0 so always crits
    const result = calculateHeroAttack(hero, monster, stats, Date.now(), 0, prng)
    expect(result.isCrit).toBe(true)
    expect(result.damage).toBe(200)  // 100 * 2.0 crit multiplier
  })

  it('returns isCrit=false when critChance=0', () => {
    const hero = makeHero({ baseStats: { attack: 10, defense: 0, speed: 0, critChance: 0, critDamage: 2.0, maxHp: 100 } })
    const monster = makeMonster()
    const stats = getEffectiveStats(hero)
    const prng = new PRNG(999)
    const result = calculateHeroAttack(hero, monster, stats, Date.now(), 0, prng)
    expect(result.isCrit).toBe(false)
    expect(result.damage).toBe(10)
  })
})

// ---- calculateMonsterAttack ----

describe('calculateMonsterAttack', () => {
  it('deals at least 1 damage', () => {
    const monster = makeMonster({ attack: 5 })
    expect(calculateMonsterAttack(monster, 0, 'warrior')).toBeGreaterThanOrEqual(1)
  })

  it('warrior defense reduces monster damage', () => {
    const monster = makeMonster({ attack: 100 })
    const noDefense = calculateMonsterAttack(monster, 0, 'warrior')
    const highDefense = calculateMonsterAttack(monster, 300, 'warrior')  // 3 stacks = 30% reduction
    expect(highDefense).toBeLessThan(noDefense)
  })

  it('mage gets no defense reduction', () => {
    const monster = makeMonster({ attack: 100 })
    const noDefense = calculateMonsterAttack(monster, 0, 'mage')
    const highDefense = calculateMonsterAttack(monster, 300, 'mage')
    expect(highDefense).toBe(noDefense)  // mage gets no reduction
  })

  it('damage reduction caps at 80%', () => {
    const monster = makeMonster({ attack: 100 })
    const massive = calculateMonsterAttack(monster, 999999, 'warrior')
    expect(massive).toBeGreaterThanOrEqual(20)  // min 20% of 100
  })
})

// ---- xpRequired ----

describe('xpRequired', () => {
  it('level 1 requires 100 XP', () => {
    expect(xpRequired(1)).toBe(100)
  })

  it('XP requirement grows with level', () => {
    expect(xpRequired(10)).toBeGreaterThan(xpRequired(5))
    expect(xpRequired(50)).toBeGreaterThan(xpRequired(10))
  })

  it('level 100 requirement is much larger than level 1', () => {
    expect(xpRequired(100)).toBeGreaterThan(10000)
  })
})

// ---- calculateIdleDPS ----

describe('calculateIdleDPS', () => {
  it('returns positive DPS for any hero', () => {
    const hero = makeHero()
    const stats = getEffectiveStats(hero)
    expect(calculateIdleDPS(stats, 'warrior', 0)).toBeGreaterThan(0)
  })

  it('higher attack stat = higher DPS', () => {
    const weak = makeHero()
    const strong = makeHero({ baseStats: { attack: 1000, defense: 10, speed: 20, critChance: 0.05, critDamage: 2.0, maxHp: 120 } })
    const wStats = getEffectiveStats(weak)
    const sStats = getEffectiveStats(strong)
    expect(calculateIdleDPS(sStats, 'warrior', 0)).toBeGreaterThan(calculateIdleDPS(wStats, 'warrior', 0))
  })
})

// ---- Soul upgrade helpers ----

describe('soul upgrade helpers', () => {
  it('getGoldMultiplierFromSoul returns 1.0 with no upgrades', () => {
    expect(getGoldMultiplierFromSoul({})).toBe(1.0)
  })

  it('getGoldMultiplierFromSoul stacks 25% per level', () => {
    expect(getGoldMultiplierFromSoul({ gold_multiplier: 2 })).toBeCloseTo(1.5)
  })

  it('getXpMultiplierFromSoul returns 1.0 with no upgrades', () => {
    expect(getXpMultiplierFromSoul({})).toBe(1.0)
  })

  it('getOfflineRate is 40% base, grows with upgrade', () => {
    expect(getOfflineRate({})).toBeCloseTo(0.40)
    expect(getOfflineRate({ offline_rate: 2 })).toBeCloseTo(0.50)
  })

  it('getStartFloor returns 1 with no upgrades', () => {
    expect(getStartFloor({})).toBe(1)
  })

  it('getStartFloor adds 5 per level', () => {
    expect(getStartFloor({ start_floor: 3 })).toBe(16)
  })
})
