import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { formatGold } from '../../utils/format'
import { DUNGEONS } from '../../data/monsters'

const CLASS_COLORS: Record<string, string> = {
  warrior: 'var(--color-class-warrior)',
  mage:    'var(--color-class-mage)',
  rogue:   'var(--color-class-rogue)',
  cleric:  'var(--color-class-cleric)',
}

const PRESTIGE_TIERS = {
  adventurer: 'Adventurer',
  hero:       'Hero',
  champion:   'Champion',
  legend:     'Legend',
  mythic:     'Mythic',
}

export function GameHeader() {
  const { hero, gold, dungeon, prestige, setShowSettingsModal } = useGameStore(useShallow(s => ({
    hero:    s.hero,
    gold:    s.gold,
    dungeon: s.dungeon,
    prestige: s.prestige,
    setShowSettingsModal: s.setShowSettingsModal,
  })))

  const dungeonName = DUNGEONS[dungeon.currentDungeon]?.name ?? 'Unknown'
  const globalFloor = dungeon.currentDungeon * 100 + dungeon.currentFloor
  const classColor  = CLASS_COLORS[hero.heroClass] ?? 'var(--color-gold-primary)'

  return (
    <header style={{
      background: 'var(--color-bg-deep)',
      borderBottom: '1px solid var(--color-ui-border)',
      padding: '0 16px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexShrink: 0,
    }}>
      {/* Game title */}
      <div style={{
        fontFamily: 'var(--font-family-display)',
        fontSize: 'var(--font-size-lg)',
        color: 'var(--color-gold-primary)',
        fontWeight: 700,
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}>
        DUNGEON ETERNAL
      </div>

      <div style={{ width: '1px', height: '24px', background: 'var(--color-ui-border)' }} />

      {/* Hero info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-sm)',
          color: classColor,
          fontWeight: 600,
        }}>
          {hero.name}
        </span>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
          {hero.heroClass.charAt(0).toUpperCase() + hero.heroClass.slice(1)}
        </span>
        <span style={{
          fontSize: 'var(--font-size-xs)',
          background: classColor + '33',
          color: classColor,
          border: `1px solid ${classColor}66`,
          borderRadius: 'var(--radius-sm)',
          padding: '1px 6px',
        }}>
          Lv.{hero.level}
        </span>
        {prestige.ascensionCount > 0 && (
          <span style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-gold-bright)',
          }}>
            ✦ {PRESTIGE_TIERS[prestige.prestigeTier]}
          </span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Dungeon info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
        <span style={{ color: 'var(--color-ui-text)' }}>{dungeonName}</span>
        <span>Floor {dungeon.currentFloor}</span>
        <span style={{ color: 'var(--color-ui-border)' }}>({globalFloor}/500)</span>
      </div>

      <div style={{ width: '1px', height: '24px', background: 'var(--color-ui-border)' }} />

      {/* Gold */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: 'var(--color-gold-primary)',
        fontFamily: 'var(--font-family-display)',
        fontSize: 'var(--font-size-sm)',
      }}>
        <span style={{ color: 'var(--color-gold-muted)' }}>⚜</span>
        {formatGold(gold)}
      </div>

      {/* Settings button */}
      <button
        onClick={() => setShowSettingsModal(true)}
        style={{
          background: 'transparent',
          border: '1px solid var(--color-ui-border)',
          borderRadius: 'var(--radius)',
          padding: '4px 10px',
          color: 'var(--color-ui-muted)',
          cursor: 'pointer',
          fontSize: 'var(--font-size-sm)',
          fontFamily: 'var(--font-family-body)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-ui-border-hover)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-ui-border)')}
      >
        ⚙
      </button>
    </header>
  )
}
