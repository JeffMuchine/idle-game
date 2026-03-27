import type { GameState } from '../types'

const SAVE_KEY = 'dungeon-eternal-save'
const TAB_LOCK_KEY = 'dungeon-eternal-tab-lock'
const SAVE_VERSION = 1

export function saveGame(state: GameState): void {
  try {
    const saveData = {
      ...state,
      saveVersion: SAVE_VERSION,
      lastSave: Date.now(),
      // Strip runtime-only UI state
      combat: {
        ...state.combat,
        floatingTexts: [],
      },
      toasts: [],
      showPrestigeModal: false,
      showOfflineModal: false,
      showSettingsModal: false,
      showImportExportModal: false,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.error('Save failed: localStorage quota exceeded')
    } else {
      console.error('Save failed:', e)
    }
  }
}

export function loadGame(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return migrateState(parsed)
  } catch (e) {
    console.error('Load failed:', e)
    return null
  }
}

export function exportSave(state: GameState): string {
  const json = JSON.stringify({ ...state, saveVersion: SAVE_VERSION, lastSave: Date.now() })
  return btoa(encodeURIComponent(json))
}

export function importSave(encoded: string): Partial<GameState> | null {
  try {
    const json = decodeURIComponent(atob(encoded.trim()))
    const parsed = JSON.parse(json)
    return migrateState(parsed)
  } catch {
    return null
  }
}

function migrateState(raw: Record<string, unknown>): Partial<GameState> {
  const version = (raw.saveVersion as number) || 0
  // Version migrations go here as the game evolves
  if (version < 1) {
    // v0 -> v1: no migration needed (initial version)
  }
  return raw as Partial<GameState>
}

export function getOfflineSeconds(): number {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return 0
    const parsed = JSON.parse(raw)
    const lastSave = parsed.lastSave as number
    if (!lastSave) return 0
    const elapsed = (Date.now() - lastSave) / 1000
    return Math.max(0, Math.min(elapsed, 86400))  // cap at 24h
  } catch {
    return 0
  }
}

// Multi-tab lock: prevent two tabs from double-counting offline progress
export function acquireTabLock(): boolean {
  try {
    const lockData = localStorage.getItem(TAB_LOCK_KEY)
    if (lockData) {
      const { tabId, ts } = JSON.parse(lockData)
      const ageMs = Date.now() - ts
      // Lock expires after 10 seconds (tab closed/crashed)
      if (ageMs < 10000 && tabId !== getTabId()) return false
    }
    localStorage.setItem(TAB_LOCK_KEY, JSON.stringify({ tabId: getTabId(), ts: Date.now() }))
    return true
  } catch {
    return true  // Fail open: allow progress rather than block
  }
}

export function releaseTabLock(): void {
  try { localStorage.removeItem(TAB_LOCK_KEY) } catch { /* ignore */ }
}

export function refreshTabLock(): void {
  try {
    const lock = localStorage.getItem(TAB_LOCK_KEY)
    if (!lock) return
    const { tabId } = JSON.parse(lock)
    if (tabId === getTabId()) {
      localStorage.setItem(TAB_LOCK_KEY, JSON.stringify({ tabId: getTabId(), ts: Date.now() }))
    }
  } catch { /* ignore */ }
}

let _tabId: string | null = null
function getTabId(): string {
  if (!_tabId) _tabId = Math.random().toString(36).slice(2)
  return _tabId
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY)
}
