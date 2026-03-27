import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { InventoryTab } from './InventoryTab'
import { SkillsTab } from './SkillsTab'
import { PrestigeTab } from './PrestigeTab'
import { BestiaryTab } from './BestiaryTab'
import { AchievementsTab } from './AchievementsTab'
import type { RightTab } from '../../types'

const TABS: Array<{ id: RightTab; label: string }> = [
  { id: 'inventory',    label: 'Loot' },
  { id: 'skills',       label: 'Skills' },
  { id: 'prestige',     label: 'Prestige' },
  { id: 'bestiary',     label: 'Bestiary' },
  { id: 'achievements', label: 'Feats' },
]

export function RightPanel() {
  const { activeTab, setActiveTab } = useGameStore(useShallow(s => ({
    activeTab:    s.activeTab,
    setActiveTab: s.setActiveTab,
  })))

  return (
    <aside style={{
      width: '280px',
      flexShrink: 0,
      background: 'var(--color-bg-panel)',
      borderLeft: '1px solid var(--color-ui-border)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-ui-border)',
        background: 'var(--color-bg-deep)',
        overflowX: 'auto',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 4px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-gold-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--color-gold-primary)' : 'var(--color-ui-muted)',
              fontFamily: 'var(--font-family-display)',
              fontSize: '10px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'inventory'    && <InventoryTab />}
        {activeTab === 'skills'       && <SkillsTab />}
        {activeTab === 'prestige'     && <PrestigeTab />}
        {activeTab === 'bestiary'     && <BestiaryTab />}
        {activeTab === 'achievements' && <AchievementsTab />}
      </div>
    </aside>
  )
}
