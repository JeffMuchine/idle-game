interface ProgressBarProps {
  value: number
  max: number
  color?: string
  label?: string
  height?: string
}

export function ProgressBar({ value, max, color = 'var(--color-gold-primary)', label, height = '14px' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div
      style={{
        height,
        background: 'var(--color-bg-deep)',
        border: '1px solid var(--color-ui-border)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.12s ease-out',
        }}
      />
      {label && (
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-ui-text)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
