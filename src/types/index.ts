// ============================================================
// Core game types for Dungeon Eternal
// ============================================================

export type HeroClass = 'warrior' | 'mage' | 'rogue' | 'cleric'
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type EquipSlot = 'weapon' | 'armor' | 'helmet' | 'ring' | 'amulet' | 'offhand'
export type GameSpeed = 1 | 2 | 4
export type RightTab = 'inventory' | 'skills' | 'prestige' | 'bestiary' | 'achievements'

export interface HeroStats {
  attack: number
  defense: number
  speed: number        // 0–200; attackSpeed = max(200, 1000 - speed * 5) ms
  critChance: number   // 0.0–1.0
  critDamage: number   // multiplier, starts at 2.5
  maxHp: number
}

export interface Item {
  id: string
  slot: EquipSlot
  rarity: Rarity
  name: string
  flavorText: string
  attack: number
  defense: number
  hp: number
  critChance: number
  speed: number
  level: number        // floor level it dropped on
}

export interface Monster {
  id: string
  dungeonIndex: number
  name: string
  flavorText: string
  hp: number
  maxHp: number
  attack: number
  xpReward: number
  goldReward: number
  isBoss: boolean
}

export interface CombatState {
  phase: 'fighting' | 'dead' | 'victory'
  heroHp: number
  heroMaxHp: number
  monster: Monster | null
  lastDamageDealt: number
  lastDamageTaken: number
  floatingTexts: FloatingText[]
  combatLog: string[]
}

export interface FloatingText {
  id: string
  text: string
  x: number
  y: number
  color: string
  expires: number
}

export interface Hero {
  name: string
  heroClass: HeroClass
  level: number
  xp: number
  xpRequired: number
  baseStats: HeroStats
  equipment: Partial<Record<EquipSlot, Item>>
  skillsUnlocked: string[]
  abilityLastUsed: Record<string, number>
}

export interface DungeonState {
  currentDungeon: number    // 0–4
  currentFloor: number      // 1–100 per dungeon (1–500 global)
  maxFloorReached: number
}

export interface PrestigeState {
  ascensionCount: number
  ascensionPoints: number
  soulUpgrades: Record<string, number>
  prestigeTier: 'adventurer' | 'hero' | 'champion' | 'legend' | 'mythic'
}

export interface LifetimeStats {
  totalDamageDealt: number
  monstersKilled: number
  bossesKilled: number
  totalGoldEarned: number
  totalXpEarned: number
  floorsCleared: number
  itemsFound: number
  legendaryFound: number
  monsterKills: Record<string, number>   // monsterId -> count
}

export interface Achievement {
  id: string
  name: string
  description: string
  flavorText: string
  unlocked: boolean
  unlockedAt?: number
}

export interface BestiaryEntry {
  monsterId: string
  name: string
  dungeonIndex: number
  killCount: number
  firstSeenFloor: number
  flavorText: string
}

export interface Settings {
  gameSpeed: GameSpeed
  muted: boolean
  autoEquip: boolean
  volume: number
}

export interface ToastNotification {
  id: string
  type: 'achievement' | 'legendary' | 'levelup' | 'prestige' | 'info'
  title: string
  body: string
  rarity?: Rarity
  expires: number
}

export interface GameState {
  // Core game data
  hero: Hero
  dungeon: DungeonState
  inventory: Item[]
  gold: number
  combat: CombatState
  prestige: PrestigeState
  stats: LifetimeStats
  achievements: Record<string, Achievement>
  bestiary: Record<string, BestiaryEntry>

  // UI
  settings: Settings
  activeTab: RightTab
  toasts: ToastNotification[]
  showPrestigeModal: boolean
  showOfflineModal: boolean
  offlineGoldEarned: number
  showSettingsModal: boolean
  showImportExportModal: boolean

  // Persistence
  saveVersion: number
  lastSave: number
}

export interface SkillNode {
  id: string
  heroClass: HeroClass
  tier: 1 | 2 | 3
  position: number    // 0–4
  name: string
  description: string
  cost: number        // SP cost
  requires: string[]  // prerequisite node IDs
  effect: SkillEffect
}

export interface SkillEffect {
  type: 'stat' | 'ability' | 'passive'
  stat?: keyof HeroStats
  multiplier?: number
  abilityId?: string
}

export interface SoulUpgrade {
  id: string
  name: string
  description: string
  maxLevel: number
  costPerLevel: number
  effect: (level: number) => Record<string, number>
}
