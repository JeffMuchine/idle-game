import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { SOUL_UPGRADES } from '../../data/soulUpgrades'

export function PrestigeTab() {
  const { prestige, dungeon, buySoulUpgrade } = useGameStore(useShallow(s => ({
    prestige:       s.prestige,
    dungeon:        s.dungeon,
    buySoulUpgrade: s.buySoulUpgrade,
  })))

  const canAscend = dungeon.maxFloorReached >= 50 || prestige.ascensionCount > 0
  const apAtCurrentFloor = Math.floor(dungeon.maxFloorReached / 50)

  return (
    <div style={{ padding: '12px' }}>
      {/* Prestige stats */}
      <div style={{
        background: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-gold-dark)',
        padding: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gold-primary)',
          marginBottom: '8px',
        }}>
          Ascension Status
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: 'var(--font-size-xs)' }}>
          <span style={{ color: 'var(--color-ui-muted)' }}>Tier</span>
          <span style={{ color: 'var(--color-gold-bright)', textTransform: 'capitalize' }}>
            {prestige.prestigeTier}
          </span>
          <span style={{ color: 'var(--color-ui-muted)' }}>Ascensions</span>
          <span style={{ color: 'var(--color-ui-text)' }}>{prestige.ascensionCount}×</span>
          <span style={{ color: 'var(--color-ui-muted)' }}>AP Available</span>
          <span style={{ color: 'var(--color-gold-primary)' }}>{prestige.ascensionPoints}</span>
          <span style={{ color: 'var(--color-ui-muted)' }}>AP at Ascend</span>
          <span style={{ color: canAscend ? 'var(--color-success)' : 'var(--color-ui-muted)' }}>
            {canAscend ? `+${apAtCurrentFloor}` : 'Reach floor 50'}
          </span>
        </div>
      </div>

      {/* Soul upgrades */}
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
        Soul Upgrades
      </div>

      {SOUL_UPGRADES.map(upgrade => {
        const currentLevel = prestige.soulUpgrades[upgrade.id] ?? 0
        const maxed        = currentLevel >= upgrade.maxLevel
        const cost         = upgrade.costPerLevel * (currentLevel + 1)
        const canAfford    = prestige.ascensionPoints >= cost
        return (
          <div key={upgrade.id} style={{
            marginBottom: '8px',
            padding: '10px',
            background: 'var(--color-bg-elevated)',
            border: `1px solid ${maxed ? 'var(--color-gold-muted)' : 'var(--color-ui-border)'}`,
            borderRadius: 'var(--radius)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                color: maxed ? 'var(--color-gold-primary)' : 'var(--color-ui-text)',
              }}>
                {upgrade.name}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--color-ui-muted)' }}>
                {currentLevel}/{upgrade.maxLevel}
              </span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-ui-muted)', marginBottom: '6px' }}>
              {upgrade.description}
            </div>
            {!maxed && (
              <button
                onClick={() => buySoulUpgrade(upgrade.id)}
                disabled={!canAfford}
                style={{
                  padding: '4px 10px',
                  background: canAfford ? 'var(--color-gold-dark)' : 'transparent',
                  border: `1px solid ${canAfford ? 'var(--color-gold-muted)' : 'var(--color-ui-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: canAfford ? 'var(--color-gold-bright)' : 'var(--color-ui-muted)',
                  fontSize: '10px',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-family-body)',
                }}
              >
                {cost} AP
              </button>
            )}
            {maxed && (
              <div style={{ fontSize: '10px', color: 'var(--color-gold-primary)' }}>✓ Maxed</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
