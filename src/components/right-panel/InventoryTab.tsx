import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { getRarityColor } from '../shared/RarityText'
import { formatNumber } from '../../utils/format'
import type { Item } from '../../types'

const SLOT_ICONS: Record<string, string> = {
  weapon: '⚔', armor: '🛡', helmet: '⛨', ring: '◎', amulet: '◈', offhand: '✦',
}

function ItemRow({ item }: { item: Item }) {
  const { equipItem, sellItem } = useGameStore(useShallow(s => ({ equipItem: s.equipItem, sellItem: s.sellItem })))
  const rarityColor = getRarityColor(item.rarity)
  const sellValue = Math.round(item.level * 5 * { common: 1, uncommon: 2, rare: 5, epic: 15, legendary: 50 }[item.rarity])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderBottom: '1px solid var(--color-ui-border)',
      minHeight: '52px',
    }}>
      <span style={{ fontSize: '12px', color: rarityColor, width: '16px', flexShrink: 0 }}>
        {SLOT_ICONS[item.slot]}
      </span>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: rarityColor,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.name}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--color-ui-muted)', marginTop: '2px' }}>
          {[
            item.attack  > 0 && `Atk+${formatNumber(item.attack)}`,
            item.defense > 0 && `Def+${formatNumber(item.defense)}`,
            item.hp      > 0 && `HP+${formatNumber(item.hp)}`,
            item.critChance > 0 && `Crit+${(item.critChance*100).toFixed(0)}%`,
            item.speed   > 0 && `Spd+${item.speed}`,
          ].filter(Boolean).join(' ')}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
        <button
          onClick={() => equipItem(item)}
          style={{
            padding: '3px 8px',
            background: 'var(--color-bg-elevated)',
            border: `1px solid ${rarityColor}66`,
            borderRadius: 'var(--radius-sm)',
            color: rarityColor,
            fontSize: '10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          Equip
        </button>
        <button
          onClick={() => sellItem(item.id)}
          style={{
            padding: '3px 6px',
            background: 'transparent',
            border: '1px solid var(--color-ui-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-ui-muted)',
            fontSize: '10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family-body)',
          }}
          title={`Sell for ${sellValue}g`}
        >
          {formatNumber(sellValue)}g
        </button>
      </div>
    </div>
  )
}

export function InventoryTab() {
  const inventory = useGameStore(useShallow(s => s.inventory))

  if (inventory.length === 0) {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', color: 'var(--color-ui-muted)', marginBottom: '8px' }}>⊡</div>
        <div style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-sm)', color: 'var(--color-ui-muted)', marginBottom: '4px' }}>
          No Items Found
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
          Slay monsters to discover loot
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ padding: '8px 12px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)', borderBottom: '1px solid var(--color-ui-border)' }}>
        {inventory.length}/50 items
      </div>
      {inventory.map(item => <ItemRow key={item.id} item={item} />)}
    </div>
  )
}
