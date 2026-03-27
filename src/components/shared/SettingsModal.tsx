import { useGameStore } from '../../stores/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { Modal } from './Modal'
import { exportSave, importSave } from '../../utils/save'
import { useState } from 'react'
import type { GameState } from '../../types'

export function SettingsModal() {
  const {
    showSettingsModal,
    settings,
    setShowSettingsModal,
    setGameSpeed,
    toggleMute,
    setAutoEquip,
    resetGame,
  } = useGameStore(useShallow(s => ({
    showSettingsModal:    s.showSettingsModal,
    settings:            s.settings,
    setShowSettingsModal: s.setShowSettingsModal,
    setGameSpeed:        s.setGameSpeed,
    toggleMute:          s.toggleMute,
    setAutoEquip:        s.setAutoEquip,
    resetGame:           s.resetGame,
  })))

  const [showImportExport, setShowImportExport] = useState(false)
  const [importText, setImportText]             = useState('')
  const [importError, setImportError]           = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  if (!showSettingsModal) return null

  const handleExport = () => {
    const state = useGameStore.getState()
    const encoded = exportSave(state as GameState)
    navigator.clipboard.writeText(encoded).catch(() => {})
    const el = document.createElement('textarea')
    el.value = encoded
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    alert('Save copied to clipboard!')
  }

  const handleImport = () => {
    const parsed = importSave(importText)
    if (!parsed) {
      setImportError('Invalid save data')
      return
    }
    window.location.reload()
  }

  const speeds = [1, 2, 4] as const

  return (
    <Modal title="⚙ Settings" onClose={() => setShowSettingsModal(false)}>
      {/* Game speed */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)', marginBottom: '8px' }}>Game Speed</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {speeds.map(s => (
            <button
              key={s}
              onClick={() => setGameSpeed(s)}
              style={{
                flex: 1, padding: '8px',
                background: settings.gameSpeed === s ? 'var(--color-gold-dark)' : 'var(--color-bg-elevated)',
                border: `1px solid ${settings.gameSpeed === s ? 'var(--color-gold-primary)' : 'var(--color-ui-border)'}`,
                borderRadius: 'var(--radius)',
                color: settings.gameSpeed === s ? 'var(--color-gold-bright)' : 'var(--color-ui-text)',
                cursor: 'pointer',
                fontFamily: 'var(--font-family-display)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div style={{ marginBottom: '16px' }}>
        <ToggleRow
          label="Mute Sound"
          value={settings.muted}
          onChange={toggleMute}
        />
        <ToggleRow
          label="Auto-Equip Better Items"
          value={settings.autoEquip}
          onChange={() => setAutoEquip(!settings.autoEquip)}
        />
      </div>

      {/* Import/Export */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ui-muted)', marginBottom: '8px' }}>Save Data</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            onClick={handleExport}
            style={btnStyle}
          >
            Export Save
          </button>
          <button
            onClick={() => setShowImportExport(!showImportExport)}
            style={btnStyle}
          >
            Import Save
          </button>
        </div>
        {showImportExport && (
          <div>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste save data here..."
              style={{
                width: '100%', padding: '8px',
                background: 'var(--color-bg-deep)',
                border: '1px solid var(--color-ui-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-ui-text)',
                fontSize: 'var(--font-size-xs)',
                fontFamily: 'monospace',
                resize: 'vertical',
                minHeight: '80px',
                marginBottom: '6px',
                boxSizing: 'border-box',
              }}
            />
            {importError && <div style={{ color: '#ef4444', fontSize: 'var(--font-size-xs)', marginBottom: '6px' }}>{importError}</div>}
            <button onClick={handleImport} style={{ ...btnStyle, width: '100%' }}>
              Load Save
            </button>
          </div>
        )}
      </div>

      {/* Reset */}
      <div style={{ borderTop: '1px solid var(--color-ui-border)', paddingTop: '12px' }}>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            style={{
              ...btnStyle,
              color: '#ef4444',
              borderColor: '#ef444466',
              width: '100%',
            }}
          >
            Reset Game
          </button>
        ) : (
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: '#ef4444', marginBottom: '10px', textAlign: 'center' }}>
              This will delete ALL progress permanently.
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={resetGame}
                style={{ ...btnStyle, flex: 1, color: '#ef4444', borderColor: '#ef4444' }}
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{ ...btnStyle, flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '8px 14px',
  background: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-ui-border)',
  borderRadius: 'var(--radius)',
  color: 'var(--color-ui-text)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
  fontFamily: 'var(--font-family-body)',
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid var(--color-ui-border)',
    }}>
      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-ui-text)' }}>{label}</span>
      <button
        onClick={onChange}
        style={{
          padding: '4px 12px',
          background: value ? '#1a2a1a' : 'var(--color-bg-elevated)',
          border: `1px solid ${value ? 'var(--color-success)' : 'var(--color-ui-border)'}`,
          borderRadius: 'var(--radius-full)',
          color: value ? 'var(--color-success)' : 'var(--color-ui-muted)',
          cursor: 'pointer',
          fontSize: 'var(--font-size-xs)',
          fontFamily: 'var(--font-family-body)',
        }}
      >
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}
