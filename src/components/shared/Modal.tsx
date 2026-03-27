import type { ReactNode } from 'react'

interface ModalProps {
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}

export function Modal({ onClose, title, children, wide }: ModalProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 500,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-ui-border)',
          borderRadius: 'var(--radius-md)',
          width: wide ? '560px' : '400px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid var(--color-ui-border)',
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-family-display)',
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-gold-primary)',
            letterSpacing: '0.04em',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--color-ui-muted)', fontSize: '18px', cursor: 'pointer',
              lineHeight: 1, padding: '4px',
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
