import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import type { ToastNotification } from '../../types'
import { getRarityColor } from './RarityText'

function Toast({ toast }: { toast: ToastNotification }) {
  const dismiss = useGameStore(s => s.dismissToast)

  const borderColor = toast.rarity
    ? getRarityColor(toast.rarity)
    : toast.type === 'achievement' ? 'var(--color-gold-primary)'
    : toast.type === 'levelup'    ? 'var(--color-class-mage)'
    : toast.type === 'prestige'   ? 'var(--color-gold-bright)'
    : 'var(--color-ui-border)'

  return (
    <div
      className="slide-in-right"
      onClick={() => dismiss(toast.id)}
      style={{
        background: 'var(--color-bg-panel)',
        border: `1px solid ${borderColor}`,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 'var(--radius)',
        padding: '10px 14px',
        minWidth: '240px',
        maxWidth: '300px',
        cursor: 'pointer',
        boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
      }}
    >
      <div style={{
        fontFamily: 'var(--font-family-display)',
        fontSize: 'var(--font-size-xs)',
        color: borderColor,
        marginBottom: '2px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {toast.title}
      </div>
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-ui-text)' }}>
        {toast.body}
      </div>
    </div>
  )
}

export function ToastStack() {
  const toasts = useGameStore(useShallow(s => s.toasts))

  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column-reverse',
      gap: '8px',
      zIndex: 1000,
      pointerEvents: 'auto',
    }}>
      {toasts.map(t => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  )
}
