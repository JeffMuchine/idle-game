import type { GameState, Achievement } from '../types'

// Check all achievement conditions and return IDs of newly unlocked achievements
export function checkAchievements(state: GameState): string[] {
  const unlocked: string[] = []
  const a = state.achievements
  const stats = state.stats
  const hero = state.hero
  const prestige = state.prestige

  const check = (id: string, condition: boolean) => {
    if (condition && !a[id]?.unlocked) unlocked.push(id)
  }

  // Combat
  check('first_kill',    stats.monstersKilled >= 1)
  check('kills_100',     stats.monstersKilled >= 100)
  check('kills_1000',    stats.monstersKilled >= 1000)
  check('kills_10000',   stats.monstersKilled >= 10000)
  check('first_boss',    stats.bossesKilled >= 1)
  check('boss_5',        stats.bossesKilled >= 5)
  check('dragon_slayer', Object.keys(state.bestiary).some(k => state.bestiary[k]?.dungeonIndex === 3 && state.bestiary[k]?.killCount > 0))
  check('ability_used',  hero.skillsUnlocked.some(id => id.endsWith('_active')))

  // Loot
  check('first_drop',    stats.itemsFound >= 1)
  check('items_50',      stats.itemsFound >= 50)

  // Check equipped items for rarity achievements
  const equippedItems = Object.values(hero.equipment).filter(Boolean)
  const rarities = equippedItems.map(i => i!.rarity)
  check('first_uncommon', state.inventory.some(i => i.rarity === 'uncommon') || rarities.includes('uncommon'))
  check('first_rare',     state.inventory.some(i => i.rarity === 'rare') || rarities.includes('rare'))
  check('first_epic',     state.inventory.some(i => i.rarity === 'epic') || rarities.includes('epic'))
  check('first_legendary',stats.legendaryFound >= 1)
  check('full_set', (
    hero.equipment.weapon?.rarity &&
    hero.equipment.armor?.rarity &&
    hero.equipment.helmet?.rarity &&
    hero.equipment.ring?.rarity &&
    hero.equipment.amulet?.rarity &&
    hero.equipment.offhand?.rarity &&
    ['rare', 'epic', 'legendary'].includes(hero.equipment.weapon.rarity) &&
    ['rare', 'epic', 'legendary'].includes(hero.equipment.armor.rarity) &&
    ['rare', 'epic', 'legendary'].includes(hero.equipment.helmet.rarity) &&
    ['rare', 'epic', 'legendary'].includes(hero.equipment.ring.rarity) &&
    ['rare', 'epic', 'legendary'].includes(hero.equipment.amulet.rarity) &&
    ['rare', 'epic', 'legendary'].includes(hero.equipment.offhand.rarity)
  ) as boolean)

  // Progression
  const globalFloor = state.dungeon.currentDungeon * 100 + state.dungeon.currentFloor
  check('floor_10',  state.dungeon.maxFloorReached >= 10)
  check('floor_50',  state.dungeon.maxFloorReached >= 50)
  check('floor_100', state.dungeon.maxFloorReached >= 100)
  check('floor_250', state.dungeon.maxFloorReached >= 250)
  check('floor_500', state.dungeon.maxFloorReached >= 500)
  check('dungeon_2', state.dungeon.maxFloorReached >= 101)
  check('dungeon_3', state.dungeon.maxFloorReached >= 201)
  check('dungeon_4', state.dungeon.maxFloorReached >= 301)
  check('dungeon_5', state.dungeon.maxFloorReached >= 401)

  // Hero
  check('level_10',        hero.level >= 10)
  check('level_50',        hero.level >= 50)
  check('level_100',       hero.level >= 100)
  check('skill_unlock_1',  hero.skillsUnlocked.length >= 1)
  check('all_t1_skills',   hero.skillsUnlocked.filter(id => id.includes('_t1_')).length >= 5)
  check('all_t3_skills',   hero.skillsUnlocked.filter(id => id.includes('_t3_')).length >= 5)

  // Prestige
  check('first_prestige',  prestige.ascensionCount >= 1)
  check('prestige_3',      prestige.ascensionCount >= 3)
  check('prestige_7',      prestige.ascensionCount >= 7)
  check('prestige_15',     prestige.ascensionCount >= 15)
  check('soul_upgrade_1',  Object.values(prestige.soulUpgrades).some(v => v >= 1))
  check('soul_upgrade_all', Object.values(prestige.soulUpgrades).some(v => v >= 5))

  // Gold
  check('gold_1000',       state.gold >= 1000)
  check('gold_1m',         state.gold >= 1_000_000)
  check('total_gold_1b',   stats.totalGoldEarned >= 1_000_000_000)

  // Bestiary
  check('bestiary_10',  Object.keys(state.bestiary).length >= 10)
  check('bestiary_all', Object.keys(state.bestiary).length >= 25)

  // Speed
  check('speed_4x', state.settings.gameSpeed === 4)

  // Completionist (check last)
  const totalDefs = Object.keys(state.achievements).length
  const currentlyUnlocked = Object.values(state.achievements).filter(a => a.unlocked).length
  check('completionist', currentlyUnlocked + unlocked.length >= totalDefs - 1)

  return unlocked
}
