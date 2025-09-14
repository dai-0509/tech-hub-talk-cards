import { useEffect, useState } from 'react'
import type { Card, GameState } from '../types'

export const useSocket = () => {
  const [gameState, setGameState] = useState<GameState>({
    availableCards: [],
    usedCards: [],
    currentCard: null,
    isDrawing: false,
    participants: 0
  })
  const [participants, setParticipants] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // HTTP polling for Vercel compatibility
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch('/api/state')
        if (response.ok) {
          const state = await response.json()
          setGameState(state)
          setIsConnected(true)
        }
      } catch (err) {
        console.error('Failed to fetch game state:', err)
        setIsConnected(false)
      }
    }

    // Initial fetch
    fetchGameState()

    // Poll every 1 second for updates
    const interval = setInterval(fetchGameState, 1000)

    return () => clearInterval(interval)
  }, [])

  const drawCard = async (filters?: { category?: string; difficulty?: string }) => {
    if (gameState.isDrawing) return

    try {
      setError(null)
      const response = await fetch('/api/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters || {})
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.card && result.gameState) {
          // Update state immediately with the response
          setGameState(result.gameState)
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'カードの抽選に失敗しました')
      }
    } catch (err) {
      setError('通信エラーが発生しました')
      console.error('Draw card error:', err)
    }
  }

  const resetGame = async () => {
    try {
      const response = await fetch('/api/reset', {
        method: 'POST'
      })

      if (response.ok) {
        setError(null)
      }
    } catch (err) {
      console.error('Reset game error:', err)
    }
  }

  return {
    gameState,
    participants,
    error,
    drawCard,
    resetGame,
    isConnected
  }
}