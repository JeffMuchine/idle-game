import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { Modal } from './Modal'
export function PrestigeModal() {
  const { showPrestigeModal, prestige, dungeon, setShowPrestigeModal, ascend } = useGameStore(useShallow(s => ({
    showPrestigeModal:    s.showPrestigeModal,
    prestige:             s.prestige,
    dungeon:              s.dungeon,
    setShowPrestigeModal: s.setShowPrestigeModal,
    ascend:               s.ascend,
  })))

  if (!showPrestigeModal) return null

  const canAscend  = dungeon.maxFloorReached >= 50
  const apEarned   = Math.floor(dungeon.maxFloorReached / 50)
  const totalAP    = prestige.ascensionPoints + apEarned

  return (
    <Modal title="✦ ASCENSION" onClose={() => setShowPrestigeModal(false)}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '12px',
        }}>
          ⚡
        </div>
        <div style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-xl)',
          color: 'var(--color-gold-bright)',
          marginBottom: '8px',
        }}>
          The Eternal Cycle
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-ui-muted)', maxWidth: '300px', margin: '0 auto' }}>
          Transcend your current form. Lose your gold, equipment, and levels, but gain permanent power.
        </div>
      </div>

      <div style={{
        background: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius)',
        padding: '14px',
        marginBottom: '20px',
        border: '1px solid var(--color-gold-dark)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
          <div>
            <div style={{ color: 'var(--color-ui-muted)', fontSize: 'var(--font-size-xs)', marginBottom: '2px' }}>You LOSE</div>
            <div style={{ color: '#ef4444' }}>• All gold</div>
            <div style={{ color: '#ef4444' }}>• All equipment</div>
            <div style={{ color: '#ef4444' }}>• Level & XP</div>
            <div style={{ color: '#ef4444' }}>• Floor progress</div>
            <div style={{ color: '#ef4444' }}>• Skill points</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-ui-muted)', fontSize: 'var(--font-size-xs)', marginBottom: '2px' }}>You KEEP</div>
            <div style={{ color: 'var(--color-success)' }}>• Bestiary</div>
            <div style={{ color: 'var(--color-success)' }}>• Achievements</div>
            <div style={{ color: 'var(--color-success)' }}>• Ascension Points</div>
            <div style={{ color: 'var(--color-success)' }}>• Soul Upgrades</div>
            <div style={{ color: 'var(--color-success)' }}>• Prestige tier</div>
          </div>
        </div>
      </div>

      {canAscend ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gold-primary)' }}>
            You will earn <strong style={{ color: 'var(--color-gold-bright)' }}>{apEarned} Ascension Points</strong>
          </div>
          <div style={{ marginBottom: '16px', fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)' }}>
            Total after ascension: {totalAP} AP
          </div>
          <button
            onClick={ascend}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #3d2e0a, #6b4a12)',
              border: '1px solid var(--color-gold-primary)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-gold-bright)',
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-base)',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              boxShadow: '0 0 20px rgba(201,168,76,0.3)',
            }}
          >
            ✦ ASCEND NOW ✦
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--color-ui-muted)', fontSize: 'var(--font-size-sm)' }}>
          Reach Floor 50 to unlock Ascension
          <div style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
            ({dungeon.maxFloorReached}/50 floors reached)
          </div>
        </div>
      )}
    </Modal>
  )
}
