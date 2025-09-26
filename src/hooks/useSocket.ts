import { useEffect, useState } from 'react'
import type { GameState } from '../types'

export const useSocket = () => {
  const [gameState, setGameState] = useState<GameState>({
    availableCards: [],
    usedCards: [],
    currentCard: null,
    isDrawing: false,
    participants: 0
  })
  const [participants] = useState(0)
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

  const drawCard = async () => {
    if (gameState.isDrawing) {
      console.log('Draw card blocked: already drawing')
      return
    }

    try {
      console.log('Starting card draw')
      setError(null)
      
      const response = await fetch('/api/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      console.log('API response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('API response data:', result)
        
        if (result.success && result.message) {
          console.log('Card draw initiated:', result.message)
          // Don't show error - the actual card will come via polling
        } else if (result.success && result.card && result.gameState) {
          console.log('Updating game state with drawn card:', result.card.title)
          setGameState(result.gameState)
        } else {
          console.error('Invalid response format:', result)
          setError('無効なレスポンス形式です')
        }
      } else {
        const errorData = await response.json()
        console.error('API error response:', errorData)
        setError(errorData.error || 'カードの抽選に失敗しました')
      }
    } catch (err) {
      console.error('Draw card error details:', err)
      setError(`通信エラー: ${err instanceof Error ? err.message : String(err)}`)
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