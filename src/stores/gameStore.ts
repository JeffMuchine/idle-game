import { create } from 'zustand'
import type { GameState, Hero, HeroClass, Item, EquipSlot, Monster, RightTab, GameSpeed } from '../types'
import { xpRequired, getEffectiveStats, calculateHeroAttack, calculateMonsterAttack, tryActivateAbility, calculateIdleDPS, getGoldMultiplierFromSoul, getXpMultiplierFromSoul, getOfflineRate, getStartFloor } from '../engine/combat'
import { checkAchievements } from '../engine/achievements'
import { generateItem, rollItemDrop, ALL_SLOTS } from '../data/items'
import { getMonstersForDungeon, getBossForDungeon, scaleMonster, DUNGEONS } from '../data/monsters'
import { buildInitialAchievements } from '../data/achievements'
import { saveGame, loadGame, getOfflineSeconds, acquireTabLock } from '../utils/save'
import { sfx, setMuted } from '../utils/sound'
import { PRNG, seedFromFloor } from '../utils/prng'
import { getSkillById, getSkillsForClass } from '../data/skills'
import { SOUL_UPGRADES } from '../data/soulUpgrades'

// ============================================================
// Initial state factory
// ============================================================

function makeInitialHero(name: string, heroClass: HeroClass): Hero {
  const classStats: Record<HeroClass, Hero['baseStats']> = {
    warrior: { attack: 15, defense: 10, speed: 20, critChance: 0.05, critDamage: 2.0, maxHp: 120 },
    mage:    { attack: 20, defense: 3,  speed: 30, critChance: 0.08, critDamage: 2.5, maxHp: 70  },
    rogue:   { attack: 12, defense: 5,  speed: 50, critChance: 0.20, critDamage: 3.0, maxHp: 85  },
    cleric:  { attack: 12, defense: 8,  speed: 25, critChance: 0.05, critDamage: 2.0, maxHp: 100 },
  }
  return {
    name,
    heroClass,
    level: 1,
    xp: 0,
    xpRequired: xpRequired(1),
    baseStats: classStats[heroClass],
    equipment: {},
    skillsUnlocked: [],
    abilityLastUsed: {},
  }
}

function makeInitialState(heroName: string, heroClass: HeroClass): GameState {
  const hero = makeInitialHero(heroName, heroClass)
  const stats = getEffectiveStats(hero)
  return {
    hero,
    dungeon: { currentDungeon: 0, currentFloor: 1, maxFloorReached: 1 },
    inventory: [],
    gold: 0,
    combat: {
      phase: 'fighting',
      heroHp: stats.maxHp,
      heroMaxHp: stats.maxHp,
      monster: null,
      lastDamageDealt: 0,
      lastDamageTaken: 0,
      floatingTexts: [],
      combatLog: [],
    },
    prestige: {
      ascensionCount: 0,
      ascensionPoints: 0,
      soulUpgrades: {},
      prestigeTier: 'adventurer',
    },
    stats: {
      totalDamageDealt: 0,
      monstersKilled: 0,
      bossesKilled: 0,
      totalGoldEarned: 0,
      totalXpEarned: 0,
      floorsCleared: 0,
      itemsFound: 0,
      legendaryFound: 0,
      monsterKills: {},
    },
    achievements: buildInitialAchievements(),
    bestiary: {},
    settings: { gameSpeed: 1, muted: false, autoEquip: true, volume: 0.5 },
    activeTab: 'inventory',
    toasts: [],
    showPrestigeModal: false,
    showOfflineModal: false,
    offlineGoldEarned: 0,
    showSettingsModal: false,
    showImportExportModal: false,
    saveVersion: 1,
    lastSave: Date.now(),
  }
}

// ============================================================
// Prestige tier
// ============================================================

function calcPrestigeTier(count: number): GameState['prestige']['prestigeTier'] {
  if (count >= 15) return 'mythic'
  if (count >= 7)  return 'legend'
  if (count >= 3)  return 'champion'
  if (count >= 1)  return 'hero'
  return 'adventurer'
}

// ============================================================
// Monster spawning
// ============================================================

let _killCount = 0

function spawnMonster(dungeonIndex: number, floor: number): Monster {
  _killCount++
  const isBossFloor = floor % 10 === 0
  let template
  if (isBossFloor) {
    template = getBossForDungeon(dungeonIndex)
    if (!template) template = getMonstersForDungeon(dungeonIndex)[0]
  } else {
    const monsters = getMonstersForDungeon(dungeonIndex)
    const prng = new PRNG(seedFromFloor(floor, _killCount))
    template = prng.pick(monsters)
  }
  const scaled = scaleMonster(template!, floor + dungeonIndex * 100)
  return {
    id: template!.id,
    dungeonIndex,
    name: template!.name,
    flavorText: template!.flavorText,
    hp: scaled.hp,
    maxHp: scaled.hp,
    attack: scaled.attack,
    xpReward: scaled.xp,
    goldReward: scaled.gold,
    isBoss: template!.isBoss,
  }
}

// ============================================================
// Combat log helper
// ============================================================

function addToLog(log: string[], entry: string): string[] {
  const newLog = [entry, ...log].slice(0, 3)
  return newLog
}

// ============================================================
// Store
// ============================================================

export interface GameStore extends GameState {
  // Setup
  initGame: (name: string, heroClass: HeroClass) => void
  loadSavedGame: () => boolean

  // Tick
  processTick: (now: number) => void

  // UI
  setActiveTab: (tab: RightTab) => void
  dismissToast: (id: string) => void
  setShowPrestigeModal: (show: boolean) => void
  setShowSettingsModal: (show: boolean) => void
  setShowImportExportModal: (show: boolean) => void
  dismissOfflineModal: () => void

  // Settings
  setGameSpeed: (speed: GameSpeed) => void
  toggleMute: () => void
  setAutoEquip: (v: boolean) => void

  // Equipment
  equipItem: (item: Item) => void
  unequipItem: (slot: EquipSlot) => void
  sellItem: (itemId: string) => void

  // Skills
  unlockSkill: (nodeId: string) => void

  // Prestige
  ascend: () => void
  buySoulUpgrade: (upgradeId: string) => void

  // Save
  triggerSave: () => void
  resetGame: () => void
}

// ============================================================
// Helper: unique toast ID
// ============================================================

let _toastId = 0
function nextToastId() { return `toast_${++_toastId}` }

// ============================================================
// Auto-equip check
// ============================================================

function shouldAutoEquip(newItem: Item, currentItem: Item | undefined): boolean {
  if (!currentItem) return true
  const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 }
  if (RARITY_ORDER[newItem.rarity] > RARITY_ORDER[currentItem.rarity]) return true
  if (RARITY_ORDER[newItem.rarity] < RARITY_ORDER[currentItem.rarity]) return false
  // Same rarity: compare total stat contribution
  const newPower = newItem.attack + newItem.defense + newItem.hp / 10 + newItem.critChance * 100 + newItem.speed
  const curPower = currentItem.attack + currentItem.defense + currentItem.hp / 10 + currentItem.critChance * 100 + currentItem.speed
  return newPower > curPower
}

// ============================================================
// Zustand store creation
// ============================================================

export const useGameStore = create<GameStore>((set, get) => ({
  ...makeInitialState('Hero', 'warrior'),

  initGame: (name, heroClass) => {
    const state = makeInitialState(name, heroClass)
    const stats = getEffectiveStats(state.hero)
    state.combat.heroHp = stats.maxHp
    state.combat.heroMaxHp = stats.maxHp
    state.combat.monster = spawnMonster(0, 1)
    set(state)
  },

  loadSavedGame: () => {
    const saved = loadGame()
    if (!saved) return false

    // Calculate offline progress
    const offlineSeconds = getOfflineSeconds()
    if (offlineSeconds > 300 && acquireTabLock()) {  // > 5 minutes
      const savedState = saved as GameState
      const stats = getEffectiveStats(savedState.hero)
      const offlineRate = getOfflineRate(savedState.prestige?.soulUpgrades ?? {})
      const idleDPS = calculateIdleDPS(stats, savedState.hero.heroClass, savedState.dungeon?.currentDungeon ?? 0)
      const goldMult = getGoldMultiplierFromSoul(savedState.prestige?.soulUpgrades ?? {})
      const offlineGold = Math.round(idleDPS * offlineRate * Math.min(offlineSeconds, 86400) * goldMult)

      set({
        ...saved,
        gold: (saved.gold ?? 0) + offlineGold,
        offlineGoldEarned: offlineGold,
        showOfflineModal: true,
        combat: {
          ...(saved.combat ?? {}),
          floatingTexts: [],
          monster: spawnMonster(
            saved.dungeon?.currentDungeon ?? 0,
            saved.dungeon?.currentFloor ?? 1
          ),
        },
        toasts: [],
      } as GameState)
    } else {
      set({
        ...saved,
        combat: {
          ...(saved.combat ?? {}),
          floatingTexts: [],
          monster: spawnMonster(
            saved.dungeon?.currentDungeon ?? 0,
            saved.dungeon?.currentFloor ?? 1
          ),
        },
        toasts: [],
      } as GameState)
    }
    return true
  },

  // ============================================================
  // Main tick — all state changes batched into one set()
  // ============================================================
  processTick: (now: number) => {
    const state = get()
    const { hero, dungeon, combat, settings, prestige, stats } = state

    if (combat.phase !== 'fighting' || !combat.monster) {
      // Spawn a monster if there isn't one
      if (!combat.monster) {
        set(s => ({
          combat: { ...s.combat, monster: spawnMonster(dungeon.currentDungeon, dungeon.currentFloor), phase: 'fighting' }
        }))
      }
      return
    }

    const effectiveStats = getEffectiveStats(hero)
    const prng = new PRNG(seedFromFloor(dungeon.currentFloor, now))
    const newLog = [...combat.combatLog]
    const newFloating = [...combat.floatingTexts].filter(ft => ft.expires > now)
    let newToasts = [...state.toasts].filter(t => t.expires > now)

    // ---- Hero HP regen (Cleric passive) ----
    let heroHp = combat.heroHp
    if (hero.skillsUnlocked.includes('c_t3_regen')) {
      heroHp = Math.min(heroHp + effectiveStats.maxHp * 0.01, effectiveStats.maxHp)
    }

    // ---- Ability check ----
    const abilityResult = tryActivateAbility(hero, combat.monster, effectiveStats, now, dungeon.currentDungeon)
    let newAbilityLastUsed = { ...hero.abilityLastUsed }

    // ---- Hero attacks monster ----
    const attackResult = calculateHeroAttack(hero, combat.monster, effectiveStats, now, dungeon.currentDungeon, prng)
    let damageToMonster = attackResult.damage
    let combatLogEntry = ''

    if (abilityResult) {
      damageToMonster += abilityResult.damage
      newAbilityLastUsed[abilityResult.abilityId] = now
      combatLogEntry = `${abilityResult.name}! ${damageToMonster} damage`
      sfx.attack()
      if (abilityResult.abilityId.includes('fireball')) sfx.abilityFireball()
      else if (abilityResult.abilityId.includes('cleave')) sfx.abilityCleave()
      else if (abilityResult.abilityId.includes('smite')) sfx.abilitySmite()
      else if (abilityResult.abilityId.includes('backstab')) sfx.abilityBackstab()
    } else {
      combatLogEntry = attackResult.isCrit
        ? `Critical hit! ${damageToMonster}`
        : `Hit! ${damageToMonster}`
      sfx.attack()
    }

    let newMonsterHp = combat.monster.hp - damageToMonster
    const newStats = { ...stats, totalDamageDealt: stats.totalDamageDealt + damageToMonster }

    // Floating damage text
    newFloating.push({
      id: `ft_${now}`,
      text: attackResult.isCrit ? `${damageToMonster}!` : `${damageToMonster}`,
      x: 50 + (prng.next() - 0.5) * 30,
      y: 40,
      color: attackResult.isCrit ? '#ffd700' : '#e8e0d0',
      expires: now + 1000,
    })

    let newGold = state.gold
    let newHero = { ...hero, abilityLastUsed: newAbilityLastUsed }
    let newPrestige = { ...prestige }
    let newInventory = [...state.inventory]
    let newBestiary = { ...state.bestiary }
    let newDungeon = { ...dungeon }
    let newAchievements = { ...state.achievements }
    let newCombatPhase: GameState['combat']['phase'] = 'fighting'
    let newMonster = { ...combat.monster, hp: Math.max(0, newMonsterHp) }

    // ---- Monster dies ----
    if (newMonsterHp <= 0) {
      const monster = combat.monster
      newCombatPhase = 'victory'

      const goldMult = getGoldMultiplierFromSoul(prestige.soulUpgrades)
      const xpMult   = getXpMultiplierFromSoul(prestige.soulUpgrades)
      const goldBonus = newHero.skillsUnlocked.reduce((acc, id) => {
        const node = getSkillById(id)
        if (node?.effect.abilityId === 'gold_bonus_5')  return acc * 1.05
        if (node?.effect.abilityId === 'gold_bonus_15') return acc * 1.15
        if (node?.effect.abilityId === 'gold_bonus_30') return acc * 1.30
        return acc
      }, 1)
      const xpBonus = newHero.skillsUnlocked.reduce((acc, id) => {
        const node = getSkillById(id)
        if (node?.effect.abilityId === 'xp_bonus_5') return acc * 1.05
        return acc
      }, 1)

      const goldEarned = Math.round(monster.goldReward * goldMult * goldBonus)
      const xpEarned   = Math.round(monster.xpReward  * xpMult  * xpBonus)

      newGold = newGold + goldEarned
      newStats.monstersKilled++
      newStats.totalGoldEarned += goldEarned
      newStats.totalXpEarned   += xpEarned
      newStats.monsterKills = { ...newStats.monsterKills, [monster.id]: (newStats.monsterKills[monster.id] ?? 0) + 1 }
      if (monster.isBoss) newStats.bossesKilled++

      combatLogEntry = `${monster.name} slain! +${goldEarned}g +${xpEarned}XP`
      sfx.victory()

      // Bestiary
      if (!newBestiary[monster.id]) {
        newBestiary[monster.id] = {
          monsterId: monster.id,
          name: monster.name,
          dungeonIndex: monster.dungeonIndex,
          killCount: 1,
          firstSeenFloor: dungeon.currentFloor,
          flavorText: monster.flavorText,
        }
      } else {
        newBestiary[monster.id] = { ...newBestiary[monster.id], killCount: newBestiary[monster.id].killCount + 1 }
      }

      // XP / level up
      let newXp = newHero.xp + xpEarned
      let newLevel = newHero.level
      let newXpRequired = newHero.xpRequired
      while (newXp >= newXpRequired && newLevel < 100) {
        newXp -= newXpRequired
        newLevel++
        newXpRequired = xpRequired(newLevel)
        sfx.levelUp()
        newToasts.push({
          id: nextToastId(),
          type: 'levelup',
          title: `Level ${newLevel}!`,
          body: 'You gained a skill point.',
          expires: now + 4000,
        })
      }
      newHero = { ...newHero, level: newLevel, xp: newXp, xpRequired: newXpRequired }

      // Item drop check
      const dropPrng = new PRNG(seedFromFloor(dungeon.currentFloor, _killCount))
      if (rollItemDrop(dungeon.currentFloor, dropPrng)) {
        const itemSeed = seedFromFloor(dungeon.currentFloor, _killCount + 7919)
        const newItem = generateItem(dungeon.currentFloor, itemSeed)
        newStats.itemsFound++
        if (newItem.rarity === 'legendary') {
          newStats.legendaryFound++
          sfx.itemDrop('legendary')
          newToasts.push({
            id: nextToastId(),
            type: 'legendary',
            title: `LEGENDARY DROP!`,
            body: newItem.name,
            rarity: 'legendary',
            expires: now + 8000,
          })
        } else {
          sfx.itemDrop(newItem.rarity)
        }

        if (settings.autoEquip && shouldAutoEquip(newItem, newHero.equipment[newItem.slot])) {
          const displaced = newHero.equipment[newItem.slot]
          newHero = { ...newHero, equipment: { ...newHero.equipment, [newItem.slot]: newItem } }
          if (displaced) {
            newInventory = [...newInventory, displaced].slice(0, 50)
          }
        } else {
          newInventory = [...newInventory, newItem].slice(0, 50)
        }
      }

      // Advance floor
      const nextFloor = dungeon.currentFloor + 1
      if (nextFloor > 100) {
        const nextDungeon = dungeon.currentDungeon + 1
        if (nextDungeon <= 4) {
          newDungeon = { currentDungeon: nextDungeon, currentFloor: 1, maxFloorReached: Math.max(dungeon.maxFloorReached, nextDungeon * 100 + 1) }
        } else {
          // Floor 500 cleared — reset to floor 1 of dungeon 4 (end of content until prestige)
          newDungeon = { ...dungeon, currentFloor: 100 }
        }
      } else {
        newDungeon = {
          ...dungeon,
          currentFloor: nextFloor,
          maxFloorReached: Math.max(dungeon.maxFloorReached, dungeon.currentDungeon * 100 + nextFloor),
        }
      }
      newStats.floorsCleared++

      // Recalculate maxHp with new hero (may have leveled)
      const newEffectiveStats = getEffectiveStats(newHero)
      heroHp = Math.min(heroHp, newEffectiveStats.maxHp)

      // Spawn next monster (slight delay — handled by phase)
      setTimeout(() => {
        set(s => ({
          combat: {
            ...s.combat,
            monster: spawnMonster(s.dungeon.currentDungeon, s.dungeon.currentFloor),
            phase: 'fighting',
          }
        }))
      }, 300)

    } else {
      // ---- Monster attacks hero ----
      const monsterDmg = calculateMonsterAttack(combat.monster, effectiveStats.defense, hero.heroClass, prng)
      heroHp = heroHp - monsterDmg
      newStats.totalDamageDealt += 0  // already counted above

      if (monsterDmg > 0) {
        newFloating.push({
          id: `ft_dmg_${now}`,
          text: `-${monsterDmg}`,
          x: 50 + (prng.next() - 0.5) * 20,
          y: 60,
          color: '#ef4444',
          expires: now + 800,
        })
        sfx.enemyAttack()
      }

      // Hero dies — respawn on same floor
      if (heroHp <= 0) {
        heroHp = effectiveStats.maxHp  // full heal on death
        combatLogEntry = `You were defeated! Respawning...`
        newCombatPhase = 'dead'
        setTimeout(() => {
          set(s => ({
            combat: {
              ...s.combat,
              phase: 'fighting',
              heroHp: getEffectiveStats(s.hero).maxHp,
              monster: spawnMonster(s.dungeon.currentDungeon, s.dungeon.currentFloor),
            }
          }))
        }, 1500)
      }
    }

    // Achievement check
    const tempState: GameState = {
      ...state,
      hero: newHero,
      dungeon: newDungeon,
      gold: newGold,
      stats: newStats,
      bestiary: newBestiary,
      inventory: newInventory,
      prestige: newPrestige,
      achievements: newAchievements,
      combat: {
        ...combat,
        heroHp,
        heroMaxHp: getEffectiveStats(newHero).maxHp,
        monster: newMonster,
        phase: newCombatPhase,
        combatLog: addToLog(newLog, combatLogEntry),
        floatingTexts: newFloating,
        lastDamageDealt: damageToMonster,
        lastDamageTaken: 0,
      },
    }

    const newlyUnlocked = checkAchievements(tempState)
    for (const achievId of newlyUnlocked) {
      newAchievements = {
        ...newAchievements,
        [achievId]: { ...newAchievements[achievId], unlocked: true, unlockedAt: now }
      }
      sfx.achievementUnlock()
      newToasts.push({
        id: nextToastId(),
        type: 'achievement',
        title: 'Achievement Unlocked!',
        body: newAchievements[achievId]?.name ?? achievId,
        expires: now + 4000,
      })
    }

    set({
      hero: newHero,
      dungeon: newDungeon,
      gold: newGold,
      stats: newStats,
      bestiary: newBestiary,
      inventory: newInventory,
      prestige: newPrestige,
      achievements: newAchievements,
      toasts: newToasts,
      combat: {
        phase: newCombatPhase,
        heroHp: Math.max(0, heroHp),
        heroMaxHp: getEffectiveStats(newHero).maxHp,
        monster: newMonster,
        lastDamageDealt: damageToMonster,
        lastDamageTaken: combat.monster ? calculateMonsterAttack(combat.monster, effectiveStats.defense, hero.heroClass, prng) : 0,
        floatingTexts: newFloating,
        combatLog: addToLog(newLog, combatLogEntry),
      },
    })
  },

  // ============================================================
  // UI actions
  // ============================================================
  setActiveTab: (tab) => set({ activeTab: tab }),
  dismissToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
  setShowPrestigeModal: (show) => set({ showPrestigeModal: show }),
  setShowSettingsModal: (show) => set({ showSettingsModal: show }),
  setShowImportExportModal: (show) => set({ showImportExportModal: show }),
  dismissOfflineModal: () => set({ showOfflineModal: false }),

  setGameSpeed: (speed) => {
    set(s => ({ settings: { ...s.settings, gameSpeed: speed } }))
    if (speed === 4) {
      const newlyUnlocked = checkAchievements({ ...get(), settings: { ...get().settings, gameSpeed: 4 } })
      if (newlyUnlocked.includes('speed_4x')) {
        set(s => ({
          achievements: { ...s.achievements, speed_4x: { ...s.achievements['speed_4x'], unlocked: true, unlockedAt: Date.now() } }
        }))
      }
    }
  },

  toggleMute: () => {
    const muted = !get().settings.muted
    setMuted(muted)
    set(s => ({ settings: { ...s.settings, muted } }))
  },

  setAutoEquip: (v) => set(s => ({ settings: { ...s.settings, autoEquip: v } })),

  // ============================================================
  // Equipment
  // ============================================================
  equipItem: (item) => {
    set(s => {
      const displaced = s.hero.equipment[item.slot]
      const newEquipment = { ...s.hero.equipment, [item.slot]: item }
      const newInventory = s.inventory.filter(i => i.id !== item.id)
      if (displaced) newInventory.push(displaced)
      sfx.click()
      return {
        hero: { ...s.hero, equipment: newEquipment },
        inventory: newInventory.slice(0, 50),
      }
    })
  },

  unequipItem: (slot) => {
    set(s => {
      const item = s.hero.equipment[slot]
      if (!item) return {}
      const newEquipment = { ...s.hero.equipment }
      delete newEquipment[slot]
      return {
        hero: { ...s.hero, equipment: newEquipment },
        inventory: [...s.inventory, item].slice(0, 50),
      }
    })
  },

  sellItem: (itemId) => {
    set(s => {
      const item = s.inventory.find(i => i.id === itemId)
      if (!item) return {}
      const sellValue = Math.round(item.level * 5 * { common: 1, uncommon: 2, rare: 5, epic: 15, legendary: 50 }[item.rarity])
      sfx.goldPickup()
      return {
        inventory: s.inventory.filter(i => i.id !== itemId),
        gold: s.gold + sellValue,
        stats: { ...s.stats, totalGoldEarned: s.stats.totalGoldEarned + sellValue },
      }
    })
  },

  // ============================================================
  // Skills
  // ============================================================
  unlockSkill: (nodeId) => {
    set(s => {
      const node = getSkillById(nodeId)
      if (!node) return {}
      if (node.heroClass !== s.hero.heroClass) return {}
      if (s.hero.skillsUnlocked.includes(nodeId)) return {}

      // Check requirements
      const reqs = node.requires
      if (reqs.some(r => !s.hero.skillsUnlocked.includes(r))) return {}

      // Check SP
      const spSpent = s.hero.skillsUnlocked.reduce((acc, id) => {
        const n = getSkillById(id)
        return acc + (n?.cost ?? 0)
      }, 0)
      const spTotal = s.hero.level - 1
      const spAvailable = spTotal - spSpent
      if (spAvailable < node.cost) return {}

      sfx.click()
      return {
        hero: { ...s.hero, skillsUnlocked: [...s.hero.skillsUnlocked, nodeId] }
      }
    })
  },

  // ============================================================
  // Prestige
  // ============================================================
  ascend: () => {
    set(s => {
      if (s.dungeon.maxFloorReached < 50) return {}  // Can't ascend before floor 50

      // AP = 1 per 50 floors reached
      const maxFloor = s.dungeon.maxFloorReached
      const apEarned = Math.floor(maxFloor / 50)
      const bonusAP = s.prestige.soulUpgrades['ap_gain'] ?? 0

      const newPrestige = {
        ...s.prestige,
        ascensionCount: s.prestige.ascensionCount + 1,
        ascensionPoints: s.prestige.ascensionPoints + apEarned + bonusAP,
        prestigeTier: calcPrestigeTier(s.prestige.ascensionCount + 1),
      }

      const stats = getEffectiveStats(s.hero)
      const startFloor = getStartFloor(s.prestige.soulUpgrades)
      const newHero = makeInitialHero(s.hero.name, s.hero.heroClass)

      sfx.prestige()

      return {
        hero: newHero,
        dungeon: { currentDungeon: 0, currentFloor: startFloor, maxFloorReached: startFloor },
        inventory: [],
        gold: 0,
        combat: {
          phase: 'fighting',
          heroHp: getEffectiveStats(newHero).maxHp,
          heroMaxHp: getEffectiveStats(newHero).maxHp,
          monster: spawnMonster(0, startFloor),
          lastDamageDealt: 0,
          lastDamageTaken: 0,
          floatingTexts: [],
          combatLog: ['A new run begins...'],
        },
        prestige: newPrestige,
        showPrestigeModal: false,
        toasts: [{
          id: nextToastId(),
          type: 'prestige',
          title: 'Ascension Complete!',
          body: `You are now a ${newPrestige.prestigeTier}. +${apEarned + bonusAP} Ascension Points`,
          expires: Date.now() + 8000,
        }],
      }
    })
  },

  buySoulUpgrade: (upgradeId) => {
    set(s => {
      const upgrade = SOUL_UPGRADES.find(u => u.id === upgradeId)
      if (!upgrade) return {}
      const currentLevel = s.prestige.soulUpgrades[upgradeId] ?? 0
      if (currentLevel >= upgrade.maxLevel) return {}
      const cost = upgrade.costPerLevel * (currentLevel + 1)
      if (s.prestige.ascensionPoints < cost) return {}
      sfx.click()
      return {
        prestige: {
          ...s.prestige,
          ascensionPoints: s.prestige.ascensionPoints - cost,
          soulUpgrades: { ...s.prestige.soulUpgrades, [upgradeId]: currentLevel + 1 },
        }
      }
    })
  },

  // ============================================================
  // Save
  // ============================================================
  triggerSave: () => {
    saveGame(get())
  },

  resetGame: () => {
    localStorage.removeItem('dungeon-eternal-save')
    window.location.reload()
  },
}))

// ============================================================
// Selector shortcuts
// ============================================================

export const selectHero       = (s: GameStore) => s.hero
export const selectCombat     = (s: GameStore) => s.combat
export const selectDungeon    = (s: GameStore) => s.dungeon
export const selectInventory  = (s: GameStore) => s.inventory
export const selectGold       = (s: GameStore) => s.gold
export const selectPrestige   = (s: GameStore) => s.prestige
export const selectStats      = (s: GameStore) => s.stats
export const selectSettings   = (s: GameStore) => s.settings
export const selectAchievements = (s: GameStore) => s.achievements
export const selectBestiary   = (s: GameStore) => s.bestiary
export const selectToasts     = (s: GameStore) => s.toasts
export const selectActiveTab  = (s: GameStore) => s.activeTab
