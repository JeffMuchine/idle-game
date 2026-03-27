import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { ProgressBar } from '../shared/ProgressBar'
import { formatNumber } from '../../utils/format'
import { DUNGEONS } from '../../data/monsters'

const DUNGEON_THEMES: Record<number, { bg: string; accent: string }> = {
  0: { bg: '#1a1008', accent: '#8b4513' },
  1: { bg: '#0a1208', accent: '#2d5016' },
  2: { bg: '#0f0a14', accent: '#4a1a6b' },
  3: { bg: '#1a0a00', accent: '#8b2a00' },
  4: { bg: '#0a0a0a', accent: '#1a0a2a' },
}

export function CenterPanel() {
  const { combat, dungeon } = useGameStore(useShallow(s => ({
    combat:  s.combat,
    dungeon: s.dungeon,
  })))

  const monster   = combat.monster
  const theme     = DUNGEON_THEMES[dungeon.currentDungeon] ?? DUNGEON_THEMES[0]
  const isBossFloor = dungeon.currentFloor % 10 === 0

  return (
    <main style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: theme.bg,
    }}>
      {/* Dungeon progress bar */}
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid var(--color-ui-border)',
        background: 'var(--color-bg-panel)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
          <span>{DUNGEONS[dungeon.currentDungeon]?.name}</span>
          <span>Floor {dungeon.currentFloor} / 100</span>
        </div>
        <ProgressBar
          value={dungeon.currentFloor}
          max={100}
          color={isBossFloor ? '#ff8000' : 'var(--color-gold-primary)'}
          height="8px"
        />
      </div>

      {/* Combat arena */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '20px',
        gap: '16px',
      }}>

        {/* Boss floor banner */}
        {isBossFloor && monster?.isBoss && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-family-display)',
            fontSize: 'var(--font-size-sm)',
            color: '#ff8000',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            ⚡ BOSS ENCOUNTER ⚡
          </div>
        )}

        {/* Monster display */}
        {monster ? (
          <div style={{
            textAlign: 'center',
            width: '100%',
            maxWidth: '360px',
          }}>
            {/* Monster name */}
            <div style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: isBossFloor ? 'var(--font-size-xl)' : 'var(--font-size-lg)',
              color: monster.isBoss ? '#ff8000' : 'var(--color-ui-text)',
              marginBottom: '4px',
              textShadow: monster.isBoss ? '0 0 20px #ff8000aa' : 'none',
            }}>
              {monster.name}
            </div>

            {/* Flavor text */}
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-ui-muted)',
              fontStyle: 'italic',
              marginBottom: '12px',
              maxWidth: '280px',
              margin: '0 auto 12px',
            }}>
              {monster.flavorText}
            </div>

            {/* Monster icon */}
            <div style={{
              fontSize: monster.isBoss ? '80px' : '60px',
              margin: '16px 0',
              filter: combat.phase === 'dead' ? 'grayscale(1) opacity(0.5)' : 'none',
              transition: 'filter 0.3s',
            }}>
              {getMonsterEmoji(dungeon.currentDungeon, monster.isBoss)}
            </div>

            {/* Monster HP bar */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
                <span>HP</span>
                <span>{formatNumber(Math.max(0, monster.hp))} / {formatNumber(monster.maxHp)}</span>
              </div>
              <ProgressBar
                value={Math.max(0, monster.hp)}
                max={monster.maxHp}
                color={monster.isBoss ? '#ff8000' : '#ef4444'}
                height="16px"
              />
            </div>
          </div>
        ) : (
          <div style={{
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-ui-muted)',
            fontFamily: 'var(--font-family-display)',
          }}>
            Entering dungeon...
          </div>
        )}

        {/* Floating damage texts */}
        {combat.floatingTexts.map(ft => (
          <div
            key={ft.id}
            className="float-up"
            style={{
              position: 'absolute',
              left: `${ft.x}%`,
              top: `${ft.y}%`,
              transform: 'translateX(-50%)',
              color: ft.color,
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 700,
              pointerEvents: 'none',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {ft.text}
          </div>
        ))}
      </div>

      {/* Combat log */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid var(--color-ui-border)',
        background: 'var(--color-bg-panel)',
        minHeight: '56px',
      }}>
        {combat.combatLog.slice(0, 3).map((entry, i) => (
          <div key={i} style={{
            fontSize: 'var(--font-size-xs)',
            color: i === 0 ? 'var(--color-ui-text)' : 'var(--color-ui-muted)',
            lineHeight: '1.4',
            fontFamily: 'monospace',
          }}>
            {i === 0 ? '▶ ' : '  '}{entry}
          </div>
        ))}
      </div>
    </main>
  )
}

function getMonsterEmoji(dungeonIndex: number, isBoss: boolean): string {
  if (isBoss) {
    const bosses = ['👑', '🐺', '💀', '🐉', '☠']
    return bosses[dungeonIndex] ?? '👹'
  }
  const icons = [
    ['👺', '🦎', '🕷', '🐀', '🧌'],   // Goblin Caves
    ['🐺', '🌲', '🗡', '🧙', '🌿'],   // Dark Forest
    ['💀', '🧟', '🦇', '👻', '⚰'],    // Undead Crypt
    ['🐲', '🦕', '🔥', '⚔', '🏔'],   // Dragon's Lair
    ['👿', '⚔', '🧙', '🌑', '💫'],   // Lich's Fortress
  ]
  const row = icons[dungeonIndex] ?? icons[0]
  return row[Math.floor(Math.random() * row.length)]
}
