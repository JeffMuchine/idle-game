import type { HeroClass, SkillNode } from '../types'

// 15 nodes per class = 60 total. 3 tiers x 5 nodes. Cost: T1=1SP, T2=2SP, T3=3SP
// SP gained: 1 per level-up

function makeSkills(heroClass: HeroClass, nodes: Omit<SkillNode, 'heroClass'>[]): SkillNode[] {
  return nodes.map(n => ({ ...n, heroClass }))
}

const WARRIOR_SKILLS: SkillNode[] = makeSkills('warrior', [
  // Tier 1
  { id: 'w_t1_attack',   tier: 1, position: 0, name: 'Iron Grip',       description: '+10% attack',            cost: 1, requires: [], effect: { type: 'stat', stat: 'attack',    multiplier: 1.10 } },
  { id: 'w_t1_defense',  tier: 1, position: 1, name: 'Shield Training', description: '+10% defense',           cost: 1, requires: [], effect: { type: 'stat', stat: 'defense',   multiplier: 1.10 } },
  { id: 'w_t1_hp',       tier: 1, position: 2, name: 'Thick Hide',      description: '+10% max HP',            cost: 1, requires: [], effect: { type: 'stat', stat: 'maxHp',     multiplier: 1.10 } },
  { id: 'w_t1_gold',     tier: 1, position: 3, name: 'Plunder',         description: '+5% gold from kills',    cost: 1, requires: [], effect: { type: 'passive', abilityId: 'gold_bonus_5' } },
  { id: 'w_t1_xp',       tier: 1, position: 4, name: 'Battle-Hardened', description: '+5% XP from kills',     cost: 1, requires: [], effect: { type: 'passive', abilityId: 'xp_bonus_5' } },
  // Tier 2
  { id: 'w_t2_attack',   tier: 2, position: 0, name: 'Weapon Mastery',  description: '+20% attack',            cost: 2, requires: ['w_t1_attack'],  effect: { type: 'stat', stat: 'attack',    multiplier: 1.20 } },
  { id: 'w_t2_crit',     tier: 2, position: 1, name: 'Reckless Blow',   description: '+5% crit chance',        cost: 2, requires: ['w_t1_defense'], effect: { type: 'stat', stat: 'critChance', multiplier: 1.0, } },
  { id: 'w_t2_speed',    tier: 2, position: 2, name: 'Battle Rhythm',   description: '+10% attack speed',      cost: 2, requires: ['w_t1_hp'],      effect: { type: 'stat', stat: 'speed',     multiplier: 1.10 } },
  { id: 'w_t2_gold',     tier: 2, position: 3, name: 'War Spoils',      description: '+15% gold from kills',   cost: 2, requires: ['w_t1_gold'],    effect: { type: 'passive', abilityId: 'gold_bonus_15' } },
  { id: 'w_t2_ability',  tier: 2, position: 4, name: 'Cleave Training', description: 'Unlocks Cleave ability', cost: 2, requires: ['w_t1_xp'],      effect: { type: 'ability', abilityId: 'cleave' } },
  // Tier 3
  { id: 'w_t3_cleave',   tier: 3, position: 0, name: 'Cleave',          description: 'Hits all monsters for 50% damage (30s cooldown)', cost: 3, requires: ['w_t2_ability'], effect: { type: 'ability', abilityId: 'cleave_active' } },
  { id: 'w_t3_defense',  tier: 3, position: 1, name: 'Fortress',        description: '+20% defense',           cost: 3, requires: ['w_t2_attack'],  effect: { type: 'stat', stat: 'defense',   multiplier: 1.20 } },
  { id: 'w_t3_hp',       tier: 3, position: 2, name: 'Juggernaut',      description: '+20% max HP',            cost: 3, requires: ['w_t2_speed'],   effect: { type: 'stat', stat: 'maxHp',     multiplier: 1.20 } },
  { id: 'w_t3_crit',     tier: 3, position: 3, name: 'Crushing Blow',   description: 'Crit damage +0.5x',      cost: 3, requires: ['w_t2_crit'],    effect: { type: 'stat', stat: 'critDamage', multiplier: 1.0 } },
  { id: 'w_t3_gold',     tier: 3, position: 4, name: 'Conqueror',       description: '+30% gold from kills',   cost: 3, requires: ['w_t2_gold'],    effect: { type: 'passive', abilityId: 'gold_bonus_30' } },
])

const MAGE_SKILLS: SkillNode[] = makeSkills('mage', [
  { id: 'm_t1_attack',  tier: 1, position: 0, name: 'Arcane Focus',    description: '+10% attack',            cost: 1, requires: [], effect: { type: 'stat', stat: 'attack', multiplier: 1.10 } },
  { id: 'm_t1_int',     tier: 1, position: 1, name: 'Intelligence',    description: '+10% attack (INT)',       cost: 1, requires: [], effect: { type: 'stat', stat: 'attack', multiplier: 1.10 } },
  { id: 'm_t1_hp',      tier: 1, position: 2, name: 'Mana Shield',     description: '+10% max HP',             cost: 1, requires: [], effect: { type: 'stat', stat: 'maxHp',  multiplier: 1.10 } },
  { id: 'm_t1_gold',    tier: 1, position: 3, name: 'Transmutation',   description: '+5% gold from kills',    cost: 1, requires: [], effect: { type: 'passive', abilityId: 'gold_bonus_5' } },
  { id: 'm_t1_xp',      tier: 1, position: 4, name: 'Studying',        description: '+5% XP from kills',      cost: 1, requires: [], effect: { type: 'passive', abilityId: 'xp_bonus_5' } },
  { id: 'm_t2_attack',  tier: 2, position: 0, name: 'Spell Power',     description: '+20% attack',            cost: 2, requires: ['m_t1_attack'], effect: { type: 'stat', stat: 'attack', multiplier: 1.20 } },
  { id: 'm_t2_crit',    tier: 2, position: 1, name: 'Critical Cast',   description: '+5% crit chance',        cost: 2, requires: ['m_t1_int'],    effect: { type: 'stat', stat: 'critChance', multiplier: 1.0 } },
  { id: 'm_t2_speed',   tier: 2, position: 2, name: 'Haste',           description: '+10% attack speed',      cost: 2, requires: ['m_t1_hp'],     effect: { type: 'stat', stat: 'speed', multiplier: 1.10 } },
  { id: 'm_t2_gold',    tier: 2, position: 3, name: 'Alchemy',         description: '+15% gold from kills',   cost: 2, requires: ['m_t1_gold'],   effect: { type: 'passive', abilityId: 'gold_bonus_15' } },
  { id: 'm_t2_ability', tier: 2, position: 4, name: 'Fireball Rune',   description: 'Unlocks Fireball',       cost: 2, requires: ['m_t1_xp'],     effect: { type: 'ability', abilityId: 'fireball' } },
  { id: 'm_t3_fireball',tier: 3, position: 0, name: 'Fireball',        description: '3x damage burst (15s cooldown)', cost: 3, requires: ['m_t2_ability'], effect: { type: 'ability', abilityId: 'fireball_active' } },
  { id: 'm_t3_attack',  tier: 3, position: 1, name: 'Arcane Mastery',  description: '+30% attack',            cost: 3, requires: ['m_t2_attack'], effect: { type: 'stat', stat: 'attack', multiplier: 1.30 } },
  { id: 'm_t3_crit',    tier: 3, position: 2, name: 'Chain Lightning',  description: 'Crit damage +0.5x',     cost: 3, requires: ['m_t2_crit'],   effect: { type: 'stat', stat: 'critDamage', multiplier: 1.0 } },
  { id: 'm_t3_hp',      tier: 3, position: 3, name: 'Aegis',           description: '+20% max HP',             cost: 3, requires: ['m_t2_speed'],  effect: { type: 'stat', stat: 'maxHp', multiplier: 1.20 } },
  { id: 'm_t3_gold',    tier: 3, position: 4, name: 'Philosopher Stone', description: '+30% gold from kills', cost: 3, requires: ['m_t2_gold'],   effect: { type: 'passive', abilityId: 'gold_bonus_30' } },
])

const ROGUE_SKILLS: SkillNode[] = makeSkills('rogue', [
  { id: 'r_t1_attack',  tier: 1, position: 0, name: 'Blade Training',  description: '+10% attack',            cost: 1, requires: [], effect: { type: 'stat', stat: 'attack', multiplier: 1.10 } },
  { id: 'r_t1_crit',    tier: 1, position: 1, name: 'Keen Eye',        description: '+5% crit chance',        cost: 1, requires: [], effect: { type: 'stat', stat: 'critChance', multiplier: 1.0 } },
  { id: 'r_t1_speed',   tier: 1, position: 2, name: 'Quick Feet',      description: '+10% attack speed',      cost: 1, requires: [], effect: { type: 'stat', stat: 'speed', multiplier: 1.10 } },
  { id: 'r_t1_gold',    tier: 1, position: 3, name: 'Pickpocket',      description: '+5% gold from kills',    cost: 1, requires: [], effect: { type: 'passive', abilityId: 'gold_bonus_5' } },
  { id: 'r_t1_xp',      tier: 1, position: 4, name: 'Cunning',         description: '+5% XP from kills',      cost: 1, requires: [], effect: { type: 'passive', abilityId: 'xp_bonus_5' } },
  { id: 'r_t2_attack',  tier: 2, position: 0, name: 'Dual Wield',      description: '+20% attack',            cost: 2, requires: ['r_t1_attack'], effect: { type: 'stat', stat: 'attack', multiplier: 1.20 } },
  { id: 'r_t2_crit',    tier: 2, position: 1, name: 'Lethal Strike',   description: '+5% crit chance',        cost: 2, requires: ['r_t1_crit'],   effect: { type: 'stat', stat: 'critChance', multiplier: 1.0 } },
  { id: 'r_t2_speed',   tier: 2, position: 2, name: 'Shadow Step',     description: '+10% attack speed',      cost: 2, requires: ['r_t1_speed'],  effect: { type: 'stat', stat: 'speed', multiplier: 1.10 } },
  { id: 'r_t2_gold',    tier: 2, position: 3, name: 'Looter',          description: '+15% gold from kills',   cost: 2, requires: ['r_t1_gold'],   effect: { type: 'passive', abilityId: 'gold_bonus_15' } },
  { id: 'r_t2_ability', tier: 2, position: 4, name: 'Backstab Prep',   description: 'Unlocks Backstab',       cost: 2, requires: ['r_t1_xp'],     effect: { type: 'ability', abilityId: 'backstab' } },
  { id: 'r_t3_backstab',tier: 3, position: 0, name: 'Backstab',        description: '5x damage if enemy HP>80% (20s cooldown)', cost: 3, requires: ['r_t2_ability'], effect: { type: 'ability', abilityId: 'backstab_active' } },
  { id: 'r_t3_attack',  tier: 3, position: 1, name: 'Assassin',        description: '+20% attack',            cost: 3, requires: ['r_t2_attack'], effect: { type: 'stat', stat: 'attack', multiplier: 1.20 } },
  { id: 'r_t3_crit',    tier: 3, position: 2, name: 'Mortal Strike',   description: 'Crit damage +1.0x',      cost: 3, requires: ['r_t2_crit'],   effect: { type: 'stat', stat: 'critDamage', multiplier: 1.0 } },
  { id: 'r_t3_speed',   tier: 3, position: 3, name: 'Blur',            description: '+15% attack speed',      cost: 3, requires: ['r_t2_speed'],  effect: { type: 'stat', stat: 'speed', multiplier: 1.15 } },
  { id: 'r_t3_gold',    tier: 3, position: 4, name: 'Master Thief',    description: '+30% gold from kills',   cost: 3, requires: ['r_t2_gold'],   effect: { type: 'passive', abilityId: 'gold_bonus_30' } },
])

const CLERIC_SKILLS: SkillNode[] = makeSkills('cleric', [
  { id: 'c_t1_attack',  tier: 1, position: 0, name: 'Holy Zeal',       description: '+10% attack',            cost: 1, requires: [], effect: { type: 'stat', stat: 'attack', multiplier: 1.10 } },
  { id: 'c_t1_defense', tier: 1, position: 1, name: 'Divine Ward',     description: '+10% defense',           cost: 1, requires: [], effect: { type: 'stat', stat: 'defense', multiplier: 1.10 } },
  { id: 'c_t1_hp',      tier: 1, position: 2, name: 'Blessed Health',  description: '+10% max HP',             cost: 1, requires: [], effect: { type: 'stat', stat: 'maxHp', multiplier: 1.10 } },
  { id: 'c_t1_gold',    tier: 1, position: 3, name: 'Tithe',           description: '+5% gold from kills',    cost: 1, requires: [], effect: { type: 'passive', abilityId: 'gold_bonus_5' } },
  { id: 'c_t1_xp',      tier: 1, position: 4, name: 'Study Scripture', description: '+5% XP from kills',      cost: 1, requires: [], effect: { type: 'passive', abilityId: 'xp_bonus_5' } },
  { id: 'c_t2_attack',  tier: 2, position: 0, name: 'Holy Fury',       description: '+20% attack',            cost: 2, requires: ['c_t1_attack'],  effect: { type: 'stat', stat: 'attack', multiplier: 1.20 } },
  { id: 'c_t2_crit',    tier: 2, position: 1, name: 'Righteous Anger', description: '+5% crit chance',        cost: 2, requires: ['c_t1_defense'], effect: { type: 'stat', stat: 'critChance', multiplier: 1.0 } },
  { id: 'c_t2_speed',   tier: 2, position: 2, name: 'Blessed Haste',   description: '+10% attack speed',      cost: 2, requires: ['c_t1_hp'],      effect: { type: 'stat', stat: 'speed', multiplier: 1.10 } },
  { id: 'c_t2_gold',    tier: 2, position: 3, name: 'Sacred Wealth',   description: '+15% gold from kills',   cost: 2, requires: ['c_t1_gold'],    effect: { type: 'passive', abilityId: 'gold_bonus_15' } },
  { id: 'c_t2_ability', tier: 2, position: 4, name: 'Smite Training',  description: 'Unlocks Divine Smite',   cost: 2, requires: ['c_t1_xp'],      effect: { type: 'ability', abilityId: 'smite' } },
  { id: 'c_t3_smite',   tier: 3, position: 0, name: 'Divine Smite',    description: '3x damage, 60s cooldown', cost: 3, requires: ['c_t2_ability'], effect: { type: 'ability', abilityId: 'smite_active' } },
  { id: 'c_t3_defense', tier: 3, position: 1, name: 'Sacred Armor',    description: '+20% defense',           cost: 3, requires: ['c_t2_attack'],  effect: { type: 'stat', stat: 'defense', multiplier: 1.20 } },
  { id: 'c_t3_hp',      tier: 3, position: 2, name: 'Blessed Vessel',  description: '+20% max HP',             cost: 3, requires: ['c_t2_speed'],   effect: { type: 'stat', stat: 'maxHp', multiplier: 1.20 } },
  { id: 'c_t3_regen',   tier: 3, position: 3, name: 'Divine Renewal',  description: 'Regen 1% HP per tick',   cost: 3, requires: ['c_t2_crit'],    effect: { type: 'passive', abilityId: 'hp_regen_1' } },
  { id: 'c_t3_gold',    tier: 3, position: 4, name: 'Blessing of Wealth', description: '+30% gold from kills', cost: 3, requires: ['c_t2_gold'],   effect: { type: 'passive', abilityId: 'gold_bonus_30' } },
])

export const ALL_SKILLS: SkillNode[] = [
  ...WARRIOR_SKILLS,
  ...MAGE_SKILLS,
  ...ROGUE_SKILLS,
  ...CLERIC_SKILLS,
]

export function getSkillsForClass(heroClass: HeroClass): SkillNode[] {
  return ALL_SKILLS.filter(s => s.heroClass === heroClass)
}

export function getSkillById(id: string): SkillNode | undefined {
  return ALL_SKILLS.find(s => s.id === id)
}

// Ability cooldowns in milliseconds
export const ABILITY_COOLDOWNS: Record<string, number> = {
  cleave_active:    30000,
  fireball_active:  15000,
  backstab_active:  20000,
  smite_active:     60000,
}
