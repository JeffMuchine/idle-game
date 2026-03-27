import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { Modal } from './Modal'
import { formatGold, formatTime } from '../../utils/format'

export function OfflineModal() {
  const { showOfflineModal, offlineGoldEarned, dismissOfflineModal } = useGameStore(useShallow(s => ({
    showOfflineModal:   s.showOfflineModal,
    offlineGoldEarned:  s.offlineGoldEarned,
    dismissOfflineModal: s.dismissOfflineModal,
  })))

  if (!showOfflineModal) return null

  return (
    <Modal title="⏳ Welcome Back" onClose={dismissOfflineModal}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌙</div>
        <div style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-xl)',
          color: 'var(--color-gold-primary)',
          marginBottom: '8px',
        }}>
          While You Were Away...
        </div>
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-ui-muted)',
          marginBottom: '20px',
        }}>
          Your hero continued fighting in the dungeon.
        </div>

        {offlineGoldEarned > 0 && (
          <div style={{
            background: 'var(--color-gold-dark)',
            border: '1px solid var(--color-gold-muted)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gold-muted)', marginBottom: '6px' }}>
              Gold Earned (40% offline rate)
            </div>
            <div style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-2xl)',
              color: 'var(--color-gold-bright)',
            }}>
              +{formatGold(offlineGoldEarned)}
            </div>
          </div>
        )}

        <button
          onClick={dismissOfflineModal}
          style={{
            padding: '12px 32px',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-ui-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-ui-text)',
            fontFamily: 'var(--font-family-display)',
            fontSize: 'var(--font-size-base)',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          Continue Adventure
        </button>
      </div>
    </Modal>
  )
}
