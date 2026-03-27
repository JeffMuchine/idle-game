import { useEffect, useRef, useState } from 'react'
import { useGameStore } from './stores/gameStore'
import { useGameLoop } from './hooks/useGameLoop'
import { CharacterCreation } from './components/CharacterCreation'
import { GameHeader } from './components/header/GameHeader'
import { LeftPanel } from './components/left-panel/LeftPanel'
import { CenterPanel } from './components/center-panel/CenterPanel'
import { RightPanel } from './components/right-panel/RightPanel'
import { ToastStack } from './components/shared/ToastStack'
import { PrestigeModal } from './components/shared/PrestigeModal'
import { SettingsModal } from './components/shared/SettingsModal'
import { OfflineModal } from './components/shared/OfflineModal'
import { setMuted } from './utils/sound'

function GameLayout() {
  useGameLoop()

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <GameHeader />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
      <PrestigeModal />
      <SettingsModal />
      <OfflineModal />
      <ToastStack />
    </div>
  )
}

type AppPhase = 'loading' | 'character-creation' | 'game'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('loading')
  const loadSavedGame = useGameStore(s => s.loadSavedGame)
  const combatMonster = useGameStore(s => s.combat.monster)
  const heroName      = useGameStore(s => s.hero.name)
  const muted         = useGameStore(s => s.settings.muted)
  const initDone      = useRef(false)

  // Initialise once — load save and apply mute setting
  useEffect(() => {
    if (initDone.current) return
    initDone.current = true

    setMuted(muted)
    const loaded = loadSavedGame()
    const state = useGameStore.getState()
    // Defer state update out of the effect body to avoid cascading render warning
    Promise.resolve().then(() => {
      if (loaded && state.hero.level > 1) {
        setPhase('game')
      } else {
        setPhase('character-creation')
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Transition to game once character has been created (monster spawned + name set)
  useEffect(() => {
    if (phase === 'character-creation' && combatMonster && heroName !== 'Hero') {
      Promise.resolve().then(() => setPhase('game'))
    }
  }, [combatMonster, heroName, phase])

  if (phase === 'loading') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Cinzel', serif", color: 'var(--color-gold-muted)', fontSize: '20px' }}>
          Loading...
        </div>
      </div>
    )
  }

  if (phase === 'character-creation') return <CharacterCreation />
  return <GameLayout />
}
