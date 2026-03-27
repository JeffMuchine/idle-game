export interface MonsterTemplate {
  id: string
  dungeonIndex: number
  name: string
  flavorText: string
  hpBase: number
  attackBase: number
  xpBase: number
  goldBase: number
  isBoss: boolean
}

export const DUNGEONS = [
  { index: 0, name: 'Goblin Caves',    floors: [1,   100] },
  { index: 1, name: 'Dark Forest',     floors: [101, 200] },
  { index: 2, name: 'Undead Crypt',    floors: [201, 300] },
  { index: 3, name: "Dragon's Lair",   floors: [301, 400] },
  { index: 4, name: "Lich's Fortress", floors: [401, 500] },
]

export const MONSTER_TEMPLATES: MonsterTemplate[] = [
  // Goblin Caves
  { id: 'goblin',       dungeonIndex: 0, name: 'Goblin',       flavorText: 'A small, green-skinned menace armed with a rusty dagger.',         hpBase: 30,   attackBase: 5,  xpBase: 10, goldBase: 3,  isBoss: false },
  { id: 'kobold',       dungeonIndex: 0, name: 'Kobold',       flavorText: 'A yapping lizard creature clutching a bone club.',                  hpBase: 25,   attackBase: 6,  xpBase: 12, goldBase: 4,  isBoss: false },
  { id: 'cave_troll',   dungeonIndex: 0, name: 'Cave Troll',   flavorText: 'A lumbering beast regenerating from wounds before your eyes.',      hpBase: 80,   attackBase: 8,  xpBase: 20, goldBase: 6,  isBoss: false },
  { id: 'goblin_king',  dungeonIndex: 0, name: 'Goblin King',  flavorText: '"You shall not pass... to floor 11!" A crown sits askew on his head.', hpBase: 200, attackBase: 15, xpBase: 60, goldBase: 20, isBoss: true  },
  { id: 'cave_spider',  dungeonIndex: 0, name: 'Cave Spider',  flavorText: 'Eight cold eyes gleam in the darkness.',                            hpBase: 35,   attackBase: 7,  xpBase: 14, goldBase: 4,  isBoss: false },
  { id: 'dire_rat',     dungeonIndex: 0, name: 'Dire Rat',     flavorText: 'The size of a large dog and twice as mean.',                        hpBase: 20,   attackBase: 4,  xpBase: 8,  goldBase: 2,  isBoss: false },

  // Dark Forest
  { id: 'dire_wolf',    dungeonIndex: 1, name: 'Dire Wolf',    flavorText: 'Amber eyes, massive paws, and jaws that could shatter bone.',       hpBase: 120,  attackBase: 22, xpBase: 35, goldBase: 12, isBoss: false },
  { id: 'treant',       dungeonIndex: 1, name: 'Treant',       flavorText: 'An ancient oak that has decided it dislikes you specifically.',     hpBase: 200,  attackBase: 18, xpBase: 40, goldBase: 14, isBoss: false },
  { id: 'bandit',       dungeonIndex: 1, name: 'Bandit',       flavorText: '"Your gold or your life — actually, both."',                        hpBase: 100,  attackBase: 25, xpBase: 38, goldBase: 18, isBoss: false },
  { id: 'forest_hag',   dungeonIndex: 1, name: 'Forest Hag',   flavorText: 'She collects the bones of wanderers to decorate her cottage.',      hpBase: 140,  attackBase: 30, xpBase: 55, goldBase: 22, isBoss: false },
  { id: 'bandit_lord',  dungeonIndex: 1, name: 'Bandit Lord',  flavorText: 'He has never worked an honest day, and it shows.',                  hpBase: 500,  attackBase: 45, xpBase: 150, goldBase: 60, isBoss: true  },
  { id: 'dryad',        dungeonIndex: 1, name: 'Corrupted Dryad', flavorText: 'The forest itself weeps at what she has become.',               hpBase: 110,  attackBase: 20, xpBase: 32, goldBase: 10, isBoss: false },

  // Undead Crypt
  { id: 'skeleton',     dungeonIndex: 2, name: 'Skeleton Warrior', flavorText: 'Still wearing the armor from its last defeat.',                hpBase: 220,  attackBase: 40, xpBase: 65, goldBase: 25, isBoss: false },
  { id: 'zombie',       dungeonIndex: 2, name: 'Zombie',       flavorText: 'Slow. Relentless. Hungry.',                                        hpBase: 350,  attackBase: 30, xpBase: 55, goldBase: 20, isBoss: false },
  { id: 'lich',         dungeonIndex: 2, name: 'Lich Apprentice', flavorText: 'Not yet a true lich, but certainly trying.',                   hpBase: 280,  attackBase: 50, xpBase: 80, goldBase: 35, isBoss: false },
  { id: 'vampire',      dungeonIndex: 2, name: 'Vampire',      flavorText: 'Has not fed recently. Very, very hungry.',                         hpBase: 400,  attackBase: 60, xpBase: 100, goldBase: 45, isBoss: false },
  { id: 'lich_lord',    dungeonIndex: 2, name: 'Lich Lord',    flavorText: 'Phylactery hidden, patience infinite, hatred eternal.',            hpBase: 1200, attackBase: 90, xpBase: 350, goldBase: 120, isBoss: true  },
  { id: 'wraith',       dungeonIndex: 2, name: 'Wraith',       flavorText: 'It drifts through walls. Unfortunately walls are not helping you.', hpBase: 250, attackBase: 45, xpBase: 70, goldBase: 28, isBoss: false },

  // Dragon's Lair
  { id: 'drake',        dungeonIndex: 3, name: 'Drake',        flavorText: 'A juvenile dragon, already terrifying.',                           hpBase: 600,  attackBase: 100, xpBase: 150, goldBase: 65, isBoss: false },
  { id: 'wyvern',       dungeonIndex: 3, name: 'Wyvern',       flavorText: 'Two legs, two wings, one very bad temper.',                        hpBase: 800,  attackBase: 120, xpBase: 180, goldBase: 80, isBoss: false },
  { id: 'fire_lizard',  dungeonIndex: 3, name: 'Fire Lizard',  flavorText: 'Not technically a dragon, but tells everyone it is.',              hpBase: 550,  attackBase: 90, xpBase: 130, goldBase: 55, isBoss: false },
  { id: 'ancient_dragon', dungeonIndex: 3, name: 'Ancient Dragon', flavorText: '"I have watched civilizations rise and fall. Mostly fall."',  hpBase: 3000, attackBase: 200, xpBase: 900, goldBase: 350, isBoss: true  },
  { id: 'dragon_knight', dungeonIndex: 3, name: 'Dragon Knight', flavorText: 'Serves dragons willingly. Probably knows something you do not.', hpBase: 700, attackBase: 110, xpBase: 160, goldBase: 70, isBoss: false },

  // Lich's Fortress
  { id: 'demon',        dungeonIndex: 4, name: 'Demon',        flavorText: 'Called from the outer planes. Unimpressed by your progress.',      hpBase: 1500, attackBase: 250, xpBase: 350, goldBase: 140, isBoss: false },
  { id: 'death_knight', dungeonIndex: 4, name: 'Death Knight', flavorText: 'A paladin who made one catastrophic career change.',               hpBase: 2000, attackBase: 300, xpBase: 450, goldBase: 180, isBoss: false },
  { id: 'archlich',     dungeonIndex: 4, name: 'Archlich',     flavorText: 'Thousands of years of malice crystallized into robes.',            hpBase: 1800, attackBase: 280, xpBase: 400, goldBase: 160, isBoss: false },
  { id: 'void_demon',   dungeonIndex: 4, name: 'Void Demon',   flavorText: 'It arrived from somewhere even demons do not discuss.',            hpBase: 1600, attackBase: 260, xpBase: 360, goldBase: 145, isBoss: false },
  { id: 'eternal_lich', dungeonIndex: 4, name: 'Eternal Lich', flavorText: 'The final boss. It has been waiting for you.',                    hpBase: 10000, attackBase: 500, xpBase: 3000, goldBase: 1200, isBoss: true  },
]

// Get monsters for a given dungeon index
export function getMonstersForDungeon(dungeonIndex: number): MonsterTemplate[] {
  return MONSTER_TEMPLATES.filter(m => m.dungeonIndex === dungeonIndex && !m.isBoss)
}

// Get boss for a given dungeon index
export function getBossForDungeon(dungeonIndex: number): MonsterTemplate | undefined {
  return MONSTER_TEMPLATES.find(m => m.dungeonIndex === dungeonIndex && m.isBoss)
}

// Scale monster stats to floor level
export function scaleMonster(template: MonsterTemplate, floor: number): {
  hp: number; attack: number; xp: number; gold: number
} {
  const scale = 1 + (floor - 1) * 0.08   // 8% per floor
  return {
    hp:     Math.round(template.hpBase * scale),
    attack: Math.round(template.attackBase * scale),
    xp:     Math.round(template.xpBase + floor * 5 + template.dungeonIndex * 50),
    gold:   Math.round(template.goldBase + floor * 2 + template.dungeonIndex * 10),
  }
}
