import type { Rarity } from '../../types'

const RARITY_COLORS: Record<Rarity, string> = {
  common:    'var(--color-rarity-common)',
  uncommon:  'var(--color-rarity-uncommon)',
  rare:      'var(--color-rarity-rare)',
  epic:      'var(--color-rarity-epic)',
  legendary: 'var(--color-rarity-legendary)',
}

interface RarityTextProps {
  rarity: Rarity
  children: React.ReactNode
  className?: string
}

export function RarityText({ rarity, children, className }: RarityTextProps) {
  return (
    <span style={{ color: RARITY_COLORS[rarity] }} className={className}>
      {children}
    </span>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function getRarityColor(rarity: Rarity): string {
  return RARITY_COLORS[rarity]
}
