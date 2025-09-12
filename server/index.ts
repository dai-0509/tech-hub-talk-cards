import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import QRCode from 'qrcode'
import { networkInterfaces } from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import type { GameState, SocketEvents } from '../shared/types.js'
import { techHubCards } from '../shared/cards.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server<SocketEvents, SocketEvents>(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001

function getLocalIP(): string {
  const interfaces = networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name]
    if (nets) {
      for (const net of nets) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address
        }
      }
    }
  }
  return 'localhost'
}

// Game state
let gameState: GameState = {
  availableCards: [...techHubCards],
  usedCards: [],
  currentCard: null,
  isDrawing: false,
  participants: 0
}

// Express routes
app.use(express.static(path.join(__dirname, '../dist/client')))

app.get('/api/qr', async (req, res) => {
  try {
    const localIP = getLocalIP()
    const url = `http://${localIP}:${PORT}`
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
      ip: localIP,
      port: PORT
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
  
  // Send current game state to new client
  socket.emit('game:state', gameState)
  
  // Update participant count
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

    // Set drawing state
    gameState.isDrawing = true
    io.emit('game:state', gameState)

    // Simulate drawing animation delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredCards.length)
      const drawnCard = filteredCards[randomIndex]

      // Update game state
      gameState.currentCard = drawnCard
      gameState.availableCards = gameState.availableCards.filter(card => card.id !== drawnCard.id)
      gameState.usedCards.push(drawnCard)
      gameState.isDrawing = false

      // Broadcast to all clients
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

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP()
  console.log('🎯 Tech Hub カードシステム v2.0 起動中...\n')
  console.log('📱 参加者用URL:')
  console.log(`   http://${localIP}:${PORT}`)
  console.log(`   http://localhost:${PORT}`)
  console.log('\n🔧 管理者用URL:')
  console.log(`   http://${localIP}:${PORT}/admin`)
  console.log(`   http://localhost:${PORT}/admin`)
  console.log('\n✨ リアルタイム同期機能付き!')
  console.log('🚀 サーバー準備完了！\n')
})