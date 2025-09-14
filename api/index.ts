import express from 'express'
import QRCode from 'qrcode'
import path from 'path'
import { fileURLToPath } from 'url'
// Tech Hub カードデータ - インポートエラー回避のため直接定義
const techHubCards = [
  { id: 1, title: "最近学んだ新しい技術", description: "最近挑戦した技術や言語について話そう", category: "学習", difficulty: "initial" as const },
  { id: 2, title: "好きなプログラミング言語", description: "なぜその言語が好きなのか、魅力を語ろう", category: "技術", difficulty: "initial" as const },
  { id: 3, title: "開発環境のこだわり", description: "エディタ、ターミナル、ツールなどの個人的なこだわり", category: "環境", difficulty: "initial" as const },
  { id: 4, title: "最大の失敗談", description: "プロジェクトやコーディングでの痛い失敗体験", category: "経験", difficulty: "intermediate" as const },
  { id: 5, title: "チーム開発の工夫", description: "チームワークを良くするために実践していること", category: "チーム", difficulty: "intermediate" as const },
  { id: 6, title: "技術選定の基準", description: "新しいプロジェクトで技術を選ぶ時の判断基準", category: "設計", difficulty: "intermediate" as const },
  { id: 7, title: "コードレビューの哲学", description: "良いコードレビューとは何か、自分なりの考え", category: "チーム", difficulty: "intermediate" as const },
  { id: 8, title: "パフォーマンス改善体験", description: "アプリやシステムの速度を改善した経験", category: "最適化", difficulty: "advanced" as const },
  { id: 9, title: "設計パターンの活用", description: "実際に使って効果があったデザインパターン", category: "設計", difficulty: "advanced" as const },
  { id: 10, title: "セキュリティ対策", description: "開発で意識しているセキュリティのポイント", category: "セキュリティ", difficulty: "intermediate" as const },
  { id: 11, title: "テスト戦略", description: "効果的なテストコードの書き方や考え方", category: "品質", difficulty: "intermediate" as const },
  { id: 12, title: "リファクタリング経験", description: "レガシーコードをどう改善したか", category: "改善", difficulty: "advanced" as const },
  { id: 13, title: "API設計の思想", description: "使いやすいAPIを作るための考え方", category: "設計", difficulty: "advanced" as const },
  { id: 14, title: "データベース設計", description: "効率的なDB設計で気をつけていること", category: "データベース", difficulty: "intermediate" as const },
  { id: 15, title: "印象的だったバグ", description: "忘れられないバグとその解決方法", category: "トラブル", difficulty: "intermediate" as const },
  { id: 16, title: "お気に入りのライブラリ", description: "開発効率を上げてくれるお気に入りツール", category: "技術", difficulty: "initial" as const },
  { id: 17, title: "コードの美学", description: "美しいコードとは何か、自分なりの美意識", category: "哲学", difficulty: "intermediate" as const },
  { id: 18, title: "スケールする設計", description: "将来の拡張を考慮した設計のコツ", category: "設計", difficulty: "advanced" as const },
  { id: 19, title: "開発者としての成長", description: "エンジニアとして成長した瞬間の体験談", category: "キャリア", difficulty: "initial" as const },
  { id: 20, title: "技術の学習方法", description: "新しい技術を効率的に習得する自分なりの方法", category: "学習", difficulty: "initial" as const },
  { id: 21, title: "プロダクトマネジメント", description: "技術とビジネスの橋渡しで心がけていること", category: "マネジメント", difficulty: "advanced" as const },
  { id: 22, title: "CI/CDパイプライン", description: "開発フローを改善した自動化の取り組み", category: "DevOps", difficulty: "intermediate" as const },
  { id: 23, title: "クラウド活用", description: "AWS/Azure/GCPでの実践的な活用例", category: "インフラ", difficulty: "intermediate" as const },
  { id: 24, title: "マイクロサービス設計", description: "サービス分割の判断基準と実装のコツ", category: "アーキテクチャ", difficulty: "advanced" as const },
  { id: 25, title: "モニタリング戦略", description: "システム監視とアラートの効果的な運用", category: "運用", difficulty: "intermediate" as const },
  { id: 26, title: "技術的負債との向き合い方", description: "レガシーシステムの改善アプローチ", category: "改善", difficulty: "intermediate" as const },
  { id: 27, title: "新人育成の工夫", description: "後輩エンジニアのメンタリング経験", category: "教育", difficulty: "intermediate" as const },
  { id: 28, title: "OSS貢献体験", description: "オープンソースプロジェクトへの関わり方", category: "コミュニティ", difficulty: "intermediate" as const },
  { id: 29, title: "技術選定の失敗談", description: "選択した技術で後悔した経験とその学び", category: "失敗", difficulty: "advanced" as const },
  { id: 30, title: "理想の開発チーム", description: "最高のパフォーマンスを発揮するチームの条件", category: "チーム", difficulty: "advanced" as const }
] as const

interface GameState {
  availableCards: typeof techHubCards
  usedCards: typeof techHubCards
  currentCard: typeof techHubCards[0] | null
  isDrawing: boolean
  participants: number
}

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