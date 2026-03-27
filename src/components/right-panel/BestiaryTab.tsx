import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { formatNumber } from '../../utils/format'

export function BestiaryTab() {
  const bestiary = useGameStore(useShallow(s => s.bestiary))
  const entries  = Object.values(bestiary).sort((a, b) => b.killCount - a.killCount)

  if (entries.length === 0) {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', color: 'var(--color-ui-muted)', marginBottom: '8px' }}>☠</div>
        <div style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-sm)', color: 'var(--color-ui-muted)', marginBottom: '4px' }}>
          None Defeated
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
          Venture into the dungeon to encounter foes
        </div>
      </div>
    )
  }

  const DUNGEON_NAMES = ['Goblin Caves', 'Dark Forest', 'Undead Crypt', "Dragon's Lair", "Lich's Fortress"]

  return (
    <div>
      <div style={{ padding: '8px 12px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)', borderBottom: '1px solid var(--color-ui-border)' }}>
        {entries.length} creatures encountered
      </div>
      {entries.map(entry => (
        <div key={entry.monsterId} style={{
          padding: '10px 12px',
          borderBottom: '1px solid var(--color-ui-border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-ui-text)',
            }}>
              {entry.name}
            </span>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-gold-primary)',
              fontFamily: 'var(--font-family-display)',
            }}>
              ×{formatNumber(entry.killCount)}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-ui-muted)', fontStyle: 'italic', marginBottom: '4px' }}>
            {entry.flavorText}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-ui-muted)' }}>
            {DUNGEON_NAMES[entry.dungeonIndex]} · First seen floor {entry.firstSeenFloor}
          </div>
        </div>
      ))}
    </div>
  )
}
