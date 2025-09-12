import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Card, GameState, SocketEvents } from '../types'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<SocketEvents, SocketEvents> | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    availableCards: [],
    usedCards: [],
    currentCard: null,
    isDrawing: false,
    participants: 0
  })
  const [participants, setParticipants] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('✅ Connected to server')
      newSocket.emit('game:join')
    })

    newSocket.on('game:state', (state) => {
      setGameState(state)
    })

    newSocket.on('card:drawn', ({ card, gameState: newGameState }) => {
      setGameState(newGameState)
    })

    newSocket.on('game:reset', () => {
      setError(null)
    })

    newSocket.on('participants:update', (count) => {
      setParticipants(count)
    })

    newSocket.on('error', (message) => {
      setError(message)
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server')
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const drawCard = (filters?: { category?: string; difficulty?: string }) => {
    if (socket && !gameState.isDrawing) {
      setError(null)
      socket.emit('card:draw', filters)
    }
  }

  const resetGame = () => {
    if (socket) {
      socket.emit('game:reset')
    }
  }

  return {
    gameState,
    participants,
    error,
    drawCard,
    resetGame,
    isConnected: socket?.connected || false
  }
}