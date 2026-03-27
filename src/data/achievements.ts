import type { Achievement } from '../types'

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Combat
  { id: 'first_kill',          name: 'First Blood',       description: 'Kill your first monster',            flavorText: 'Every legend starts somewhere.' },
  { id: 'kills_100',           name: 'Monster Slayer',    description: 'Kill 100 monsters',                  flavorText: '"One hundred enemies have fallen before you. Many more await."' },
  { id: 'kills_1000',          name: 'Dungeon Veteran',   description: 'Kill 1,000 monsters',                flavorText: '"The dungeon floor is slick with the evidence of your passage."' },
  { id: 'kills_10000',         name: 'God of Slaughter',  description: 'Kill 10,000 monsters',               flavorText: '"They do not send warnings anymore. Only last rites."' },
  { id: 'first_boss',          name: 'Boss Slayer',       description: 'Defeat your first boss',             flavorText: '"It was stronger. You were cleverer."' },
  { id: 'boss_5',              name: 'Giant Killer',      description: 'Defeat 5 bosses',                    flavorText: '"They were warned. They did not listen."' },
  { id: 'dragon_slayer',       name: 'Dragon Slayer',     description: 'Defeat your first dragon boss',      flavorText: '"The bards will need a bigger stage."' },
  { id: 'crit_hit',            name: 'Weak Spot',         description: 'Land your first critical hit',       flavorText: '"Right between the eyes."' },
  { id: 'ability_used',        name: "Class Act",         description: 'Use your class ability',             flavorText: '"Power, properly applied."' },

  // Loot
  { id: 'first_drop',          name: 'Treasure Hunter',   description: 'Find your first item drop',          flavorText: '"Something shiny in the blood."' },
  { id: 'first_uncommon',      name: 'Eye for Quality',   description: 'Find your first Uncommon item',      flavorText: '"Green is the new gray."' },
  { id: 'first_rare',          name: 'Blue Streak',       description: 'Find your first Rare item',          flavorText: '"The dungeon yields its better treasures."' },
  { id: 'first_epic',          name: 'Purple Haze',       description: 'Find your first Epic item',          flavorText: '"Ancient magic hums through your hands."' },
  { id: 'first_legendary',     name: 'Legendary',         description: 'Find your first Legendary item',     flavorText: '"Songs will be written about this. Real ones."' },
  { id: 'full_set',            name: 'Full Kit',          description: 'Equip all 6 equipment slots with Rare or better', flavorText: '"Fully armored. Fully armed. Fully dangerous."' },
  { id: 'items_50',            name: 'Hoarder',           description: 'Collect 50 items total',             flavorText: '"Inventory management is a skill. Debatable."' },

  // Progression
  { id: 'floor_10',            name: 'Going Deeper',      description: 'Reach Floor 10',                     flavorText: '"The light from the surface is gone."' },
  { id: 'floor_50',            name: 'Veteran Explorer',  description: 'Reach Floor 50',                     flavorText: '"Half a dungeon behind you. Half ahead."' },
  { id: 'floor_100',           name: 'Dungeon Cleared',   description: 'Clear the first dungeon (Floor 100)', flavorText: '"The Goblin King is dead. His caves, yours."' },
  { id: 'floor_250',           name: 'Halfway There',     description: 'Reach Floor 250',                    flavorText: '"The crypt smells like old ambition."' },
  { id: 'floor_500',           name: 'Final Boss',        description: 'Reach Floor 500',                    flavorText: '"You stood before the Eternal Lich. You won."' },
  { id: 'dungeon_2',           name: 'Into the Forest',   description: 'Unlock the Dark Forest',             flavorText: '"Something watches from the trees."' },
  { id: 'dungeon_3',           name: 'Rest in Peace',     description: 'Unlock the Undead Crypt',            flavorText: '"They stopped resting."' },
  { id: 'dungeon_4',           name: 'Dragon Country',    description: "Unlock the Dragon's Lair",           flavorText: '"The heat is noticeable."' },
  { id: 'dungeon_5',           name: 'End Game',          description: "Unlock the Lich's Fortress",         flavorText: '"This is where it ends. Or begins."' },

  // Hero
  { id: 'level_10',            name: 'Rising Star',       description: 'Reach Level 10',                     flavorText: '"Power begins to accumulate."' },
  { id: 'level_50',            name: 'Seasoned Warrior',  description: 'Reach Level 50',                     flavorText: '"Half a century of experience. Visible."' },
  { id: 'level_100',           name: 'Max Level',         description: 'Reach Level 100',                    flavorText: '"There is nothing left to learn. Only to do."' },
  { id: 'skill_unlock_1',      name: 'First Skill',       description: 'Unlock your first skill node',       flavorText: '"The path of power begins."' },
  { id: 'all_t1_skills',       name: 'Foundations',       description: 'Unlock all Tier 1 skill nodes',      flavorText: '"Every tree starts with roots."' },
  { id: 'all_t3_skills',       name: 'Pinnacle',          description: 'Unlock all Tier 3 skill nodes',      flavorText: '"You have seen the ceiling. You are the ceiling."' },

  // Prestige
  { id: 'first_prestige',      name: 'Ascendant',         description: 'Complete your first Ascension',      flavorText: '"You gave it all up. You got more back."' },
  { id: 'prestige_3',          name: 'Champion',          description: 'Ascend 3 times',                     flavorText: '"The cycle is familiar. So is the victory."' },
  { id: 'prestige_7',          name: 'Legend',            description: 'Ascend 7 times',                     flavorText: '"Your name has become a warning."' },
  { id: 'prestige_15',         name: 'Mythic',            description: 'Ascend 15 times',                    flavorText: '"Beyond legend. Beyond comprehension."' },
  { id: 'soul_upgrade_1',      name: 'Soul Merchant',     description: 'Purchase your first Soul Upgrade',   flavorText: '"A bargain, in the long run."' },
  { id: 'soul_upgrade_all',    name: 'Transcendent',      description: 'Max out a Soul Upgrade',             flavorText: '"Permanence is its own reward."' },

  // Gold
  { id: 'gold_1000',           name: 'Prospector',        description: 'Accumulate 1,000 gold',              flavorText: '"Jingle jangle."' },
  { id: 'gold_1m',             name: 'Wealthy',           description: 'Accumulate 1,000,000 gold',          flavorText: '"The dragon would be jealous."' },
  { id: 'total_gold_1b',       name: 'Gilded',            description: 'Earn 1 billion gold total',          flavorText: '"The kingdom\'s GDP, in your pockets."' },

  // Meta
  { id: 'save_imported',       name: 'Saved',             description: 'Import a save file',                 flavorText: '"Continuity is everything."' },
  { id: 'bestiary_10',         name: 'Naturalist',        description: 'Encounter 10 different monster types', flavorText: '"Know your enemies."' },
  { id: 'bestiary_all',        name: 'Encyclopedist',     description: 'Encounter all monster types',        flavorText: '"Classification is the first step to conquest."' },
  { id: 'speed_4x',            name: 'In a Hurry',        description: 'Enable 4x game speed',               flavorText: '"Time is money."' },
  { id: 'completionist',       name: 'Completionist',     description: 'Unlock all achievements',            flavorText: '"There is nothing left to prove. You proved everything."' },
]

export function buildInitialAchievements(): Record<string, Achievement> {
  const result: Record<string, Achievement> = {}
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    result[def.id] = { ...def, unlocked: false }
  }
  return result
}
