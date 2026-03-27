import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'

export function AchievementsTab() {
  const achievements = useGameStore(useShallow(s => s.achievements))
  const all   = Object.values(achievements)
  const unlocked = all.filter(a => a.unlocked)
  const locked   = all.filter(a => !a.unlocked)

  return (
    <div>
      <div style={{ padding: '8px 12px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)', borderBottom: '1px solid var(--color-ui-border)' }}>
        {unlocked.length} / {all.length} unlocked
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <div style={{ padding: '6px 12px', fontSize: '10px', color: 'var(--color-gold-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--color-bg-deep)' }}>
            Unlocked
          </div>
          {unlocked.map(a => (
            <AchievementRow key={a.id} achievement={a} unlocked />
          ))}
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <div style={{ padding: '6px 12px', fontSize: '10px', color: 'var(--color-ui-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--color-bg-deep)' }}>
            Locked
          </div>
          {locked.map(a => (
            <AchievementRow key={a.id} achievement={a} unlocked={false} />
          ))}
        </div>
      )}
    </div>
  )
}

function AchievementRow({ achievement, unlocked }: {
  achievement: { id: string; name: string; description: string; flavorText: string }
  unlocked: boolean
}) {
  return (
    <div style={{
      padding: '8px 12px',
      borderBottom: '1px solid var(--color-ui-border)',
      opacity: unlocked ? 1 : 0.45,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
        <span style={{ fontSize: '12px' }}>{unlocked ? '🏆' : '🔒'}</span>
        <span style={{
          fontSize: 'var(--font-size-xs)',
          fontWeight: 600,
          color: unlocked ? 'var(--color-gold-primary)' : 'var(--color-ui-muted)',
          fontFamily: 'var(--font-family-display)',
        }}>
          {achievement.name}
        </span>
      </div>
      <div style={{ fontSize: '10px', color: 'var(--color-ui-muted)', marginLeft: '18px' }}>
        {achievement.description}
      </div>
      {unlocked && (
        <div style={{ fontSize: '10px', color: 'var(--color-ui-muted)', fontStyle: 'italic', marginLeft: '18px', marginTop: '2px' }}>
          {achievement.flavorText}
        </div>
      )}
    </div>
  )
}
