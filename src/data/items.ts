import type { EquipSlot, Rarity } from '../types'
import { PRNG } from '../utils/prng'

interface ItemNameData {
  prefix: string[]
  name: string[]
  suffix: string[]
}

const ITEM_NAMES: Record<EquipSlot, ItemNameData> = {
  weapon: {
    prefix: ['Ancient', 'Cursed', 'Blessed', 'Shadowforged', 'Runic', 'Gilded', 'Void-touched', 'Dragon-slaying'],
    name: ['Sword', 'Staff', 'Dagger', 'Mace', 'Axe', 'Spear', 'Wand', 'Flail', 'Glaive', 'Scythe'],
    suffix: ['of Doom', 'of the Fallen', 'of Shadows', "of the Dragon", 'of Eternity', 'of the Lich', 'of Valor', 'of Slaying'],
  },
  armor: {
    prefix: ['Ironclad', 'Spectral', 'Enchanted', 'Forged', 'Woven', 'Darkened', 'Holy', 'Abyssal'],
    name: ['Plate', 'Robe', 'Leather', 'Chainmail', 'Scale Mail', 'Brigandine', 'Hauberk', 'Breastplate'],
    suffix: ['of Protection', 'of the Bastion', 'of Warding', 'of Endurance', 'of the Bulwark', 'of Fortitude'],
  },
  helmet: {
    prefix: ['Iron', 'Mithril', 'Shadowed', 'Blessed', 'Crowned', 'Arcane', 'Runic', 'Ancient'],
    name: ['Helm', 'Hood', 'Crown', 'Cap', 'Coif', 'Visor', 'Circlet', 'Mask'],
    suffix: ['of Clarity', 'of the Mind', 'of Vision', 'of Wisdom', 'of Power', 'of the Sage'],
  },
  ring: {
    prefix: ['Enchanted', 'Cursed', 'Ancient', 'Spectral', 'Golden', 'Onyx', 'Ruby', 'Sapphire'],
    name: ['Ring', 'Band', 'Signet', 'Loop', 'Seal'],
    suffix: ['of Power', 'of the Adept', 'of Precision', 'of Fortune', 'of the Stars', 'of the Moon'],
  },
  amulet: {
    prefix: ['Ancient', 'Holy', 'Cursed', 'Spectral', 'Glowing', 'Faded', 'Ornate', 'Twisted'],
    name: ['Amulet', 'Pendant', 'Talisman', 'Medallion', 'Charm', 'Totem'],
    suffix: ['of Haste', 'of Alacrity', 'of Swiftness', 'of the Wind', 'of Speed', 'of the Fleet'],
  },
  offhand: {
    prefix: ['Spiked', 'Blessed', 'Enchanted', 'Ancient', 'Cracked', 'Iron', 'Holy', 'Shadow'],
    name: ['Shield', 'Orb', 'Quiver', 'Buckler', 'Focus', 'Tome', 'Barrier', 'Ward'],
    suffix: ['of Blocking', 'of the Wall', 'of Deflection', 'of Power', 'of Force', 'of the Guardian'],
  },
}

const FLAVOR_TEXTS: Record<Rarity, string[]> = {
  common:    ['Standard equipment of dungeon denizens.', 'Mass produced. Gets the job done.', 'Common as dirt.', 'Someone dropped this.'],
  uncommon:  ['Better than average.', 'A cut above the common rabble.', 'Hints of craftsmanship here.', 'Worth keeping.'],
  rare:      ['Masterwork quality.', 'Clearly made by skilled hands.', 'Adventurers would pay well for this.', 'A fine specimen.'],
  epic:      ['Imbued with considerable power.', 'Legends speak of items like this.', 'Ancient magic hums within.', 'Few have wielded such power.'],
  legendary: ['Forged in dragon fire and starlight.', 'Songs will be written about this.', 'The dungeon itself feared its owner.', 'Beyond mortal craftsmanship.'],
}

export const RARITY_DROP_RATES: Record<Rarity, number> = {
  common:    0.60,
  uncommon:  0.25,
  rare:      0.10,
  epic:      0.04,
  legendary: 0.01,
}

export const RARITY_MULTIPLIERS: Record<Rarity, number> = {
  common:    1.0,
  rare:      2.5,
  uncommon:  1.5,
  epic:      4.0,
  legendary: 8.0,
}

export const ALL_SLOTS: EquipSlot[] = ['weapon', 'armor', 'helmet', 'ring', 'amulet', 'offhand']

export function rollRarity(floor: number, prng: PRNG): Rarity {
  // Higher floors bias toward rarer drops
  const biasLevel = Math.floor(floor / 100)  // 0-4
  const roll = prng.next()

  // Shift distribution: each 100 floors, move 2% from common to uncommon
  const commonRate = Math.max(0.40, 0.60 - biasLevel * 0.02)
  const uncommonRate = Math.min(0.35, 0.25 + biasLevel * 0.01)
  const rareRate = Math.min(0.15, 0.10 + biasLevel * 0.005)
  const epicRate = Math.min(0.07, 0.04 + biasLevel * 0.004)
  const legendaryRate = Math.min(0.03, 0.01 + biasLevel * 0.002)

  let cumulative = 0
  const tiers: Array<[Rarity, number]> = [
    ['legendary', legendaryRate],
    ['epic', epicRate],
    ['rare', rareRate],
    ['uncommon', uncommonRate],
    ['common', commonRate],
  ]
  for (const [rarity, rate] of tiers) {
    cumulative += rate
    if (roll < cumulative) return rarity
  }
  return 'common'
}

export function generateItem(floor: number, seed: number): import('../types').Item {
  const prng = new PRNG(seed)
  const slot = prng.pick(ALL_SLOTS)
  const rarity = rollRarity(floor, prng)
  const mult = RARITY_MULTIPLIERS[rarity]
  const nameData = ITEM_NAMES[slot]

  // Generate name (higher rarity = more name components)
  let name: string
  if (rarity === 'legendary' || rarity === 'epic') {
    name = `${prng.pick(nameData.prefix)} ${prng.pick(nameData.name)} ${prng.pick(nameData.suffix)}`
  } else if (rarity === 'rare') {
    name = `${prng.pick(nameData.name)} ${prng.pick(nameData.suffix)}`
  } else {
    name = `${prng.pick(nameData.prefix)} ${prng.pick(nameData.name)}`
  }

  const baseValue = (10 + floor * 2) * mult

  return {
    id: `item_${seed}_${floor}`,
    slot,
    rarity,
    name,
    flavorText: prng.pick(FLAVOR_TEXTS[rarity]),
    attack:    slot === 'weapon' ? Math.round(baseValue * (0.8 + prng.next() * 0.4)) : 0,
    defense:   (slot === 'armor' || slot === 'offhand') ? Math.round(baseValue * (0.7 + prng.next() * 0.3)) : 0,
    hp:        slot === 'helmet' ? Math.round(baseValue * (0.8 + prng.next() * 0.4) * 5) : 0,
    critChance: slot === 'ring' ? Math.round(mult * 2 + prng.next() * 3) / 100 : 0,
    speed:     slot === 'amulet' ? Math.round(mult * 3 + prng.next() * 5) : 0,
    level:     floor,
  }
}

// Drop check: returns true if a drop occurs this kill
export function rollItemDrop(floor: number, prng: PRNG): boolean {
  const baseChance = 0.15
  const bonusPerFloor = 0.0005
  return prng.next() < baseChance + floor * bonusPerFloor
}
