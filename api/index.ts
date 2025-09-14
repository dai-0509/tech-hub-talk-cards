import express from 'express'
import QRCode from 'qrcode'
import path from 'path'
import { fileURLToPath } from 'url'
import type { GameState } from '../shared/types'
import { techHubCards } from '../shared/cards'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Game state (in production, you'd use a database)
let gameState: GameState = {
  availableCards: [...techHubCards],
  usedCards: [],
  currentCard: null,
  isDrawing: false,
  participants: 0
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.get('/api/qr', async (req, res) => {
  try {
    const host = req.get('host') || 'localhost:3000'
    const protocol = req.get('x-forwarded-proto') || 'https'
    const url = `${protocol}://${host}`
    
    console.log('QR Code generation - Host:', host, 'Protocol:', protocol, 'URL:', url)
    
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
    res.status(500).json({ error: 'QRコード生成に失敗しました', details: String(error) })
  }
})

app.get('/api/state', (_req, res) => {
  res.json(gameState)
})

app.post('/api/draw', async (req, res) => {
  if (gameState.isDrawing) {
    return res.status(400).json({ error: '現在カードを引いています。しばらくお待ちください。' })
  }

  const filters = req.body || {}
  let filteredCards = gameState.availableCards

  if (filters.category && filters.category !== 'all') {
    filteredCards = filteredCards.filter(card => card.category === filters.category)
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    filteredCards = filteredCards.filter(card => card.difficulty === filters.difficulty)
  }

  if (filteredCards.length === 0) {
    return res.status(400).json({ error: '該当するカードがありません！フィルターを変更してください。' })
  }

  gameState.isDrawing = true

  // Simulate drawing delay
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * filteredCards.length)
    const drawnCard = filteredCards[randomIndex]

    gameState.currentCard = drawnCard
    gameState.availableCards = gameState.availableCards.filter(card => card.id !== drawnCard.id)
    gameState.usedCards.push(drawnCard)
    gameState.isDrawing = false

    console.log(`🎯 Card drawn: "${drawnCard.title}"`)
  }, 2000)

  res.json({ success: true, message: 'カードを引いています...' })
})

app.post('/api/reset', (_req, res) => {
  gameState = {
    availableCards: [...techHubCards],
    usedCards: [],
    currentCard: null,
    isDrawing: false,
    participants: gameState.participants
  }

  console.log('🔄 Game reset')
  res.json({ success: true, message: 'ゲームがリセットされました' })
})

// Static files - serve AFTER API routes but BEFORE SPA routes
app.use(express.static(path.join(__dirname, '../public')))

// SPA routing - admin route MUST come before wildcard route
app.get('/admin', (_req, res) => {
  console.log('Admin route accessed')
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Catch-all route for SPA - MUST be last
app.get('*', (_req, res) => {
  console.log('Serving index.html for:', _req.path)
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined })
})

// For Vercel
export default app