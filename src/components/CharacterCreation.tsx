import { useState } from 'react'
import type { HeroClass } from '../types'
import { useGameStore } from '../stores/gameStore'

const CLASSES: Array<{
  id: HeroClass
  name: string
  emoji: string
  description: string
  flavor: string
  color: string
}> = [
  {
    id: 'warrior',
    name: 'Warrior',
    emoji: '⚔',
    description: 'High HP, strong defense, powerful Cleave ability',
    flavor: '"I have died a thousand deaths. The dungeon has run out of ideas."',
    color: 'var(--color-class-warrior)',
  },
  {
    id: 'mage',
    name: 'Mage',
    emoji: '🔮',
    description: 'High spell damage, fast attacks, Fireball burst',
    flavor: '"The scroll said not to read it aloud. I read it aloud."',
    color: 'var(--color-class-mage)',
  },
  {
    id: 'rogue',
    name: 'Rogue',
    emoji: '🗡',
    description: 'Ultra-fast attacks, 20%+ crit chance, devastating Backstab',
    flavor: '"I\'m not sneaking. I\'m approaching with confidence and a dagger."',
    color: 'var(--color-class-rogue)',
  },
  {
    id: 'cleric',
    name: 'Cleric',
    emoji: '✟',
    description: 'HP regeneration, holy damage bonus, Divine Smite',
    flavor: '"My deity doesn\'t approve of this dungeon. My deity is being helpful."',
    color: 'var(--color-class-cleric)',
  },
]

export function CharacterCreation() {
  const [name, setName]           = useState('')
  const [heroClass, setHeroClass] = useState<HeroClass | null>(null)
  const initGame                  = useGameStore(s => s.initGame)

  const handleStart = () => {
    if (!heroClass) return
    const heroName = name.trim() || 'The Hero'
    initGame(heroName, heroClass)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'var(--font-family-display)',
            fontSize: 'var(--font-size-3xl)',
            color: 'var(--color-gold-primary)',
            letterSpacing: '0.08em',
            marginBottom: '8px',
            textShadow: '0 0 30px rgba(201,168,76,0.3)',
          }}>
            DUNGEON ETERNAL
          </div>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-ui-muted)',
            fontStyle: 'italic',
          }}>
            An idle dungeon crawler. Your hero fights. You watch them get stronger.
          </div>
        </div>

        {/* Name input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-ui-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '6px',
          }}>
            Hero Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="The Hero"
            maxLength={20}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'var(--color-bg-panel)',
              border: '1px solid var(--color-ui-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-ui-text)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family-display)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-gold-muted)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-ui-border)'}
          />
        </div>

        {/* Class selection */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-ui-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px',
          }}>
            Choose Your Class
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {CLASSES.map(cls => (
              <button
                key={cls.id}
                onClick={() => setHeroClass(cls.id)}
                style={{
                  padding: '14px 12px',
                  background: heroClass === cls.id ? cls.color + '22' : 'var(--color-bg-panel)',
                  border: `1px solid ${heroClass === cls.id ? cls.color : 'var(--color-ui-border)'}`,
                  borderRadius: 'var(--radius)',
                  color: heroClass === cls.id ? cls.color : 'var(--color-ui-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.12s',
                  boxShadow: heroClass === cls.id ? `0 0 12px ${cls.color}33` : 'none',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{cls.emoji}</div>
                <div style={{
                  fontFamily: 'var(--font-family-display)',
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: '6px',
                }}>
                  {cls.name}
                </div>
                <div style={{ fontSize: '10px', color: heroClass === cls.id ? cls.color + 'cc' : 'var(--color-ui-muted)', lineHeight: 1.4 }}>
                  {cls.description}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontStyle: 'italic',
                  color: 'var(--color-ui-muted)',
                  marginTop: '8px',
                  lineHeight: 1.4,
                }}>
                  {cls.flavor}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!heroClass}
          style={{
            width: '100%',
            padding: '14px',
            background: heroClass ? 'linear-gradient(135deg, #3d2e0a, #6b4a12)' : 'var(--color-bg-elevated)',
            border: `1px solid ${heroClass ? 'var(--color-gold-primary)' : 'var(--color-ui-border)'}`,
            borderRadius: 'var(--radius)',
            color: heroClass ? 'var(--color-gold-bright)' : 'var(--color-ui-muted)',
            fontFamily: 'var(--font-family-display)',
            fontSize: 'var(--font-size-lg)',
            cursor: heroClass ? 'pointer' : 'not-allowed',
            letterSpacing: '0.08em',
            boxShadow: heroClass ? '0 0 20px rgba(201,168,76,0.2)' : 'none',
          }}
        >
          ENTER THE DUNGEON
        </button>
      </div>
    </div>
  )
}
