import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import QRCode from 'qrcode'
import path from 'path'
import { fileURLToPath } from 'url'
import type { GameState, SocketEvents } from '../shared/types.js'
import { techHubCards } from '../shared/cards.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)

// Game state
let gameState: GameState = {
  availableCards: [...techHubCards],
  usedCards: [],
  currentCard: null,
  isDrawing: false,
  participants: 0
}

// Socket.IO setup
const io = new Server<SocketEvents, SocketEvents>(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
})

// Express routes
app.use(express.static(path.join(__dirname, '../dist/client')))

app.get('/api/qr', async (req, res) => {
  try {
    const host = req.get('host') || 'localhost:3000'
    const protocol = req.get('x-forwarded-proto') || 'http'
    const url = `${protocol}://${host}`
    
    const qrCode = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#667eea',
        light: '#ffffff'
      }
    })
    
    res.json({
      url: url,
      qrCode: qrCode,
      ip: host,
      port: 'Production'
    })
  } catch (error) {
    console.error('QR code generation error:', error)
    res.status(500).json({ error: 'QRコード生成に失敗しました' })
  }
})

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/client/index.html'))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/client/index.html'))
})

// WebSocket handlers
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id)
  
  socket.emit('game:state', gameState)
  gameState.participants++
  io.emit('participants:update', gameState.participants)

  socket.on('game:join', () => {
    socket.emit('game:state', gameState)
  })

  socket.on('card:draw', (filters) => {
    if (gameState.isDrawing) {
      socket.emit('error', '現在カードを引いています。しばらくお待ちください。')
      return
    }

    let filteredCards = gameState.availableCards

    if (filters?.category && filters.category !== 'all') {
      filteredCards = filteredCards.filter(card => card.category === filters.category)
    }

    if (filters?.difficulty && filters.difficulty !== 'all') {
      filteredCards = filteredCards.filter(card => card.difficulty === filters.difficulty)
    }

    if (filteredCards.length === 0) {
      socket.emit('error', '該当するカードがありません！フィルターを変更してください。')
      return
    }

    gameState.isDrawing = true
    io.emit('game:state', gameState)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredCards.length)
      const drawnCard = filteredCards[randomIndex]

      gameState.currentCard = drawnCard
      gameState.availableCards = gameState.availableCards.filter(card => card.id !== drawnCard.id)
      gameState.usedCards.push(drawnCard)
      gameState.isDrawing = false

      io.emit('card:drawn', { card: drawnCard, gameState })
      console.log(`🎯 Card drawn: "${drawnCard.title}" by ${socket.id}`)
    }, 2000)
  })

  socket.on('game:reset', () => {
    gameState = {
      availableCards: [...techHubCards],
      usedCards: [],
      currentCard: null,
      isDrawing: false,
      participants: gameState.participants
    }

    io.emit('game:reset')
    io.emit('game:state', gameState)
    console.log('🔄 Game reset by', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
    gameState.participants = Math.max(0, gameState.participants - 1)
    io.emit('participants:update', gameState.participants)
  })
})

// For Vercel
export default app

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}