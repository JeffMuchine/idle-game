import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { getSkillsForClass, getSkillById } from '../../data/skills'
import type { SkillNode } from '../../types'

const TIER_LABELS = { 1: 'Tier I', 2: 'Tier II', 3: 'Tier III' }

function SkillNodeButton({ node, unlocked, canUnlock, spAvailable, onUnlock }: {
  node: SkillNode
  unlocked: boolean
  canUnlock: boolean
  spAvailable: number
  onUnlock: (id: string) => void
}) {
  const canAfford = spAvailable >= node.cost
  const active    = canUnlock && canAfford

  return (
    <button
      onClick={() => active && !unlocked && onUnlock(node.id)}
      title={`${node.description}\nCost: ${node.cost} SP${!canUnlock ? '\n(Requirements not met)' : ''}`}
      style={{
        padding: '8px',
        background: unlocked
          ? 'linear-gradient(135deg, #1a2a1a, #0f1f0f)'
          : active
            ? 'var(--color-bg-elevated)'
            : 'var(--color-bg-deep)',
        border: `1px solid ${
          unlocked ? 'var(--color-success)' :
          active   ? 'var(--color-ui-border-hover)' :
                     'var(--color-ui-border)'
        }`,
        borderRadius: 'var(--radius)',
        cursor: unlocked || !active ? 'default' : 'pointer',
        color: unlocked
          ? 'var(--color-success)'
          : active
            ? 'var(--color-ui-text)'
            : 'var(--color-ui-muted)',
        textAlign: 'left',
        width: '100%',
        opacity: !canUnlock && !unlocked ? 0.5 : 1,
      }}
    >
      <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '2px' }}>
        {unlocked && '✓ '}{node.name}
      </div>
      <div style={{ fontSize: '10px', color: unlocked ? 'var(--color-success)' : 'var(--color-ui-muted)' }}>
        {node.description}
      </div>
      {!unlocked && (
        <div style={{ fontSize: '10px', color: active && canAfford ? 'var(--color-gold-primary)' : 'var(--color-ui-muted)', marginTop: '2px' }}>
          Cost: {node.cost} SP
        </div>
      )}
    </button>
  )
}

export function SkillsTab() {
  const { hero, unlockSkill } = useGameStore(useShallow(s => ({
    hero:        s.hero,
    unlockSkill: s.unlockSkill,
  })))

  const classSkills = getSkillsForClass(hero.heroClass)
  const spSpent = hero.skillsUnlocked.reduce((acc, id) => {
    const node = getSkillById(id)
    return acc + (node?.cost ?? 0)
  }, 0)
  const spTotal     = hero.level - 1
  const spAvailable = spTotal - spSpent

  const tiers = [1, 2, 3] as const

  return (
    <div style={{ padding: '12px' }}>
      {/* SP display */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        padding: '8px 10px',
        background: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-ui-border)',
      }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>Skill Points</span>
        <span style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-sm)',
          color: spAvailable > 0 ? 'var(--color-gold-primary)' : 'var(--color-ui-text)',
        }}>
          {spAvailable} / {spTotal}
        </span>
      </div>

      {tiers.map(tier => (
        <div key={tier} style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '10px',
            color: 'var(--color-ui-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '6px',
          }}>
            {TIER_LABELS[tier]}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {classSkills
              .filter(n => n.tier === tier)
              .map(node => {
                const unlocked   = hero.skillsUnlocked.includes(node.id)
                const reqsMet    = node.requires.every(r => hero.skillsUnlocked.includes(r))
                return (
                  <SkillNodeButton
                    key={node.id}
                    node={node}
                    unlocked={unlocked}
                    canUnlock={reqsMet && !unlocked}
                    spAvailable={spAvailable}
                    onUnlock={unlockSkill}
                  />
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}
