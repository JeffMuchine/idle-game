import type { Hero, Monster, HeroClass, Item, HeroStats } from '../types'
import { PRNG } from '../utils/prng'
import { getSkillById } from '../data/skills'

// ============================================================
// Stat calculation
// ============================================================

export function getEffectiveStats(hero: Hero): HeroStats {
  const base = { ...hero.baseStats }

  // Apply equipment bonuses
  for (const item of Object.values(hero.equipment) as Item[]) {
    if (!item) continue
    base.attack    += item.attack
    base.defense   += item.defense
    base.maxHp     += item.hp
    base.critChance = Math.min(0.95, base.critChance + item.critChance)
    base.speed     += item.speed
  }

  // Apply skill tree bonuses
  const appliedCritDamageBonus: number[] = []

  for (const nodeId of hero.skillsUnlocked) {
    const node = getSkillById(nodeId)
    if (!node) continue
    const { effect } = node

    if (effect.type === 'stat' && effect.stat && effect.multiplier) {
      if (effect.stat === 'attack')     base.attack    *= effect.multiplier
      if (effect.stat === 'defense')    base.defense   *= effect.multiplier
      if (effect.stat === 'maxHp')      base.maxHp     *= effect.multiplier
      if (effect.stat === 'speed')      base.speed     *= effect.multiplier
      if (effect.stat === 'critChance') base.critChance = Math.min(0.95, base.critChance + 0.05)
      if (effect.stat === 'critDamage') appliedCritDamageBonus.push(0.5)
    }

    if (effect.abilityId === 'backstab_active') {
      appliedCritDamageBonus.push(1.0)  // rogue mortal strike
    }
  }

  for (const b of appliedCritDamageBonus) base.critDamage += b

  return {
    ...base,
    attack:    Math.max(1, Math.round(base.attack)),
    defense:   Math.max(0, Math.round(base.defense)),
    maxHp:     Math.max(1, Math.round(base.maxHp)),
    speed:     Math.min(200, Math.max(0, Math.round(base.speed))),
    critChance: Math.min(0.95, Math.max(0, base.critChance)),
    critDamage: Math.max(1.5, base.critDamage),
  }
}

// ============================================================
// Class multipliers
// ============================================================

export function getClassAttackMultiplier(heroClass: HeroClass, dungeonIndex: number): number {
  switch (heroClass) {
    case 'warrior': return 1.0
    case 'mage':    return 1.2
    case 'rogue':   return 0.8   // compensated by high crit
    case 'cleric':  return dungeonIndex >= 2 ? 1.4 : 1.0  // holy bonus vs undead
    default:        return 1.0
  }
}

// ============================================================
// Attack speed
// ============================================================

export function getAttackIntervalMs(stats: HeroStats): number {
  return Math.max(200, 1000 - stats.speed * 5)
}

// ============================================================
// Damage calculation
// ============================================================

export interface AttackResult {
  damage: number
  isCrit: boolean
  abilityUsed: string | null
}

export function calculateHeroAttack(
  hero: Hero,
  monster: Monster,
  stats: HeroStats,
  now: number,
  dungeonIndex: number,
  prng: PRNG
): AttackResult {
  const classMult = getClassAttackMultiplier(hero.heroClass, dungeonIndex)
  const isCrit = prng.next() < stats.critChance

  let damage = stats.attack * classMult * (isCrit ? stats.critDamage : 1.0)

  // Warrior damage reduction from defense (for the monster)
  if (hero.heroClass === 'warrior' && stats.defense >= 100) {
    damage *= 1 + Math.floor(stats.defense / 100) * 0.10
  }

  return {
    damage:      Math.max(1, Math.round(damage)),
    isCrit,
    abilityUsed: null,
  }
}

export function calculateMonsterAttack(
  monster: Monster,
  heroDefense: number,
  heroClass: HeroClass
): number {
  const reduction = heroClass === 'warrior' ? Math.floor(heroDefense / 100) * 0.10 : 0
  const raw = monster.attack * (1 - Math.min(0.80, reduction))
  return Math.max(1, Math.round(raw))
}

// ============================================================
// Ability activation
// ============================================================

export interface AbilityResult {
  damage: number
  name: string
  abilityId: string
}

export function tryActivateAbility(
  hero: Hero,
  monster: Monster,
  stats: HeroStats,
  now: number,
  dungeonIndex: number
): AbilityResult | null {
  const abilities = hero.skillsUnlocked.filter(id => id.endsWith('_active'))
  for (const abilityId of abilities) {
    const lastUsed = hero.abilityLastUsed[abilityId] || 0
    const cooldowns: Record<string, number> = {
      cleave_active:    30000,
      fireball_active:  15000,
      backstab_active:  20000,
      smite_active:     60000,
    }
    const cd = cooldowns[abilityId] ?? 30000
    if (now - lastUsed < cd) continue

    const classMult = getClassAttackMultiplier(hero.heroClass, dungeonIndex)
    let damage = 0
    let name = ''

    if (abilityId === 'cleave_active') {
      damage = Math.round(stats.attack * classMult * 0.5)
      name = 'Cleave'
    } else if (abilityId === 'fireball_active') {
      damage = Math.round(stats.attack * classMult * 3.0)
      name = 'Fireball'
    } else if (abilityId === 'backstab_active') {
      if (monster.hp > monster.maxHp * 0.80) {
        damage = Math.round(stats.attack * classMult * 5.0)
        name = 'Backstab'
      } else continue
    } else if (abilityId === 'smite_active') {
      damage = Math.round(stats.attack * classMult * 3.0)
      name = 'Divine Smite'
    }

    if (damage > 0) return { damage, name, abilityId }
  }
  return null
}

// ============================================================
// Idle DPS (for offline calculation)
// ============================================================

export function calculateIdleDPS(stats: HeroStats, heroClass: HeroClass, dungeonIndex: number): number {
  const classMult = getClassAttackMultiplier(heroClass, dungeonIndex)
  const avgDamage = stats.attack * classMult * (1 + stats.critChance * (stats.critDamage - 1))
  const intervalSec = getAttackIntervalMs(stats) / 1000
  return avgDamage / intervalSec
}

// ============================================================
// XP required per level
// ============================================================

export function xpRequired(level: number): number {
  return Math.round(100 * Math.pow(level, 1.6))
}

// ============================================================
// SP from level
// ============================================================

export function spFromLevel(level: number): number {
  return level - 1  // 1 SP per level gained
}

// ============================================================
// Gold/XP multipliers from soul upgrades
// ============================================================

export function getGoldMultiplierFromSoul(soulUpgrades: Record<string, number>): number {
  const lvl = soulUpgrades['gold_multiplier'] ?? 0
  return 1 + lvl * 0.25
}

export function getXpMultiplierFromSoul(soulUpgrades: Record<string, number>): number {
  const lvl = soulUpgrades['xp_rate'] ?? 0
  return 1 + lvl * 0.20
}

export function getOfflineRate(soulUpgrades: Record<string, number>): number {
  const lvl = soulUpgrades['offline_rate'] ?? 0
  return 0.40 + lvl * 0.05
}

export function getStartFloor(soulUpgrades: Record<string, number>): number {
  const lvl = soulUpgrades['start_floor'] ?? 0
  return 1 + lvl * 5
}
