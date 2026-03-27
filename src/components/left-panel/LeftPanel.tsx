import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { ProgressBar } from '../shared/ProgressBar'
import { formatNumber } from '../../utils/format'
import { getEffectiveStats, getAttackIntervalMs } from '../../engine/combat'
import { ALL_SLOTS } from '../../data/items'
import { getRarityColor } from '../shared/RarityText'
import type { EquipSlot } from '../../types'

const SLOT_ICONS: Record<EquipSlot, string> = {
  weapon:  '⚔',
  armor:   '🛡',
  helmet:  '⛨',
  ring:    '◎',
  amulet:  '◈',
  offhand: '✦',
}

const SLOT_LABELS: Record<EquipSlot, string> = {
  weapon:  'Weapon',
  armor:   'Armor',
  helmet:  'Helmet',
  ring:    'Ring',
  amulet:  'Amulet',
  offhand: 'Offhand',
}

export function LeftPanel() {
  const { hero, combat, prestige, setShowPrestigeModal, unequipItem } = useGameStore(useShallow(s => ({
    hero:               s.hero,
    combat:             s.combat,
    prestige:           s.prestige,
    setShowPrestigeModal: s.setShowPrestigeModal,
    unequipItem:        s.unequipItem,
  })))

  const stats       = getEffectiveStats(hero)
  const attackMs    = getAttackIntervalMs(stats)
  const aps         = (1000 / attackMs).toFixed(1)
  const canAscend   = prestige.ascensionCount === 0
    ? hero.level >= 10 && combat.heroHp > 0
    : true

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      background: 'var(--color-bg-panel)',
      borderRight: '1px solid var(--color-ui-border)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Hero stats */}
      <section style={{ padding: '12px', borderBottom: '1px solid var(--color-ui-border)' }}>
        <h3 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-gold-muted)',
          margin: '0 0 8px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Stats
        </h3>

        {/* HP bar */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
            <span>HP</span>
            <span style={{ color: 'var(--color-ui-text)' }}>{formatNumber(combat.heroHp)} / {formatNumber(combat.heroMaxHp)}</span>
          </div>
          <ProgressBar value={combat.heroHp} max={combat.heroMaxHp} color="#ef4444" height="10px" />
        </div>

        {/* XP bar */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
            <span>XP</span>
            <span style={{ color: 'var(--color-ui-text)' }}>{formatNumber(hero.xp)} / {formatNumber(hero.xpRequired)}</span>
          </div>
          <ProgressBar value={hero.xp} max={hero.xpRequired} color="var(--color-class-mage)" height="8px" />
        </div>

        {/* Stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: 'var(--font-size-xs)' }}>
          <StatRow label="Attack"  value={formatNumber(stats.attack)} />
          <StatRow label="Defense" value={formatNumber(stats.defense)} />
          <StatRow label="Speed"   value={`${aps}/s`} />
          <StatRow label="Crit"    value={`${(stats.critChance * 100).toFixed(0)}%`} />
          <StatRow label="Crit ×"  value={`${stats.critDamage.toFixed(1)}x`} />
          <StatRow label="Max HP"  value={formatNumber(stats.maxHp)} />
        </div>
      </section>

      {/* Equipment */}
      <section style={{ padding: '12px', flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-gold-muted)',
          margin: '0 0 8px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Equipment
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {ALL_SLOTS.map(slot => {
            const item = hero.equipment[slot]
            return (
              <div
                key={slot}
                title={item ? `${item.name}\n${item.flavorText}\n\nAtk:${item.attack} Def:${item.defense} HP:${item.hp} Crit:${(item.critChance*100).toFixed(0)}% Spd:${item.speed}` : `Empty ${SLOT_LABELS[slot]}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  background: 'var(--color-bg-elevated)',
                  border: `1px solid ${item ? getRarityColor(item.rarity) + '66' : 'var(--color-ui-border)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: item ? 'pointer' : 'default',
                  minHeight: '36px',
                }}
                onClick={() => item && unequipItem(slot)}
              >
                <span style={{ fontSize: '12px', color: 'var(--color-ui-muted)', width: '14px', flexShrink: 0 }}>
                  {SLOT_ICONS[slot]}
                </span>
                {item ? (
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{
                      fontSize: 'var(--font-size-xs)',
                      color: getRarityColor(item.rarity),
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-ui-muted)' }}>
                      {[
                        item.attack  > 0 && `Atk +${formatNumber(item.attack)}`,
                        item.defense > 0 && `Def +${formatNumber(item.defense)}`,
                        item.hp      > 0 && `HP +${formatNumber(item.hp)}`,
                        item.critChance > 0 && `Crit +${(item.critChance*100).toFixed(0)}%`,
                        item.speed   > 0 && `Spd +${item.speed}`,
                      ].filter(Boolean).join(' ')}
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
                    {SLOT_LABELS[slot]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Ascend button */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--color-ui-border)' }}>
        <button
          onClick={() => setShowPrestigeModal(true)}
          disabled={!canAscend}
          style={{
            width: '100%',
            padding: '10px',
            background: canAscend ? 'linear-gradient(135deg, #3d2e0a, #6b4a12)' : 'var(--color-bg-elevated)',
            border: `1px solid ${canAscend ? 'var(--color-gold-muted)' : 'var(--color-ui-border)'}`,
            borderRadius: 'var(--radius)',
            color: canAscend ? 'var(--color-gold-bright)' : 'var(--color-ui-muted)',
            fontFamily: 'var(--font-family-display)',
            fontSize: 'var(--font-size-sm)',
            cursor: canAscend ? 'pointer' : 'not-allowed',
            letterSpacing: '0.05em',
          }}
        >
          ✦ ASCEND
        </button>
        {prestige.ascensionPoints > 0 && (
          <div style={{ textAlign: 'center', marginTop: '4px', fontSize: 'var(--font-size-xs)', color: 'var(--color-gold-muted)' }}>
            {prestige.ascensionPoints} AP available
          </div>
        )}
      </div>
    </aside>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span style={{ color: 'var(--color-ui-muted)' }}>{label}</span>
      <span style={{ color: 'var(--color-ui-text)', textAlign: 'right' }}>{value}</span>
    </>
  )
}
