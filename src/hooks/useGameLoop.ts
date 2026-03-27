import { useEffect, useRef } from 'react'
import { useGameStore } from '../stores/gameStore'
import { saveGame } from '../utils/save'
import { refreshTabLock } from '../utils/save'

const TICK_INTERVALS: Record<1 | 2 | 4, number> = {
  1: 250,
  2: 125,
  4: 62,
}

const SAVE_INTERVAL_MS = 30_000  // auto-save every 30 seconds

export function useGameLoop() {
  const tickRef   = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const saveRef   = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const prevSpeed = useRef<1 | 2 | 4>(1)

  useEffect(() => {
    const startTick = (speed: 1 | 2 | 4) => {
      clearInterval(tickRef.current)
      tickRef.current = setInterval(() => {
        // Read state directly from store (not from React closure) to avoid stale closure
        useGameStore.getState().processTick(Date.now())
      }, TICK_INTERVALS[speed])
    }

    // Start auto-save loop
    saveRef.current = setInterval(() => {
      const state = useGameStore.getState()
      saveGame(state)
      refreshTabLock()
    }, SAVE_INTERVAL_MS)

    // Start initial tick
    const currentSpeed = useGameStore.getState().settings.gameSpeed as 1 | 2 | 4
    startTick(currentSpeed)
    prevSpeed.current = currentSpeed

    // Subscribe to speed changes
    const unsub = useGameStore.subscribe((state) => {
      const speed = state.settings.gameSpeed as 1 | 2 | 4
      if (speed !== prevSpeed.current) {
        prevSpeed.current = speed
        startTick(speed)
      }
    })

    return () => {
      clearInterval(tickRef.current)
      clearInterval(saveRef.current)
      unsub()
    }
  }, [])
}
