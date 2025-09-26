import { VercelRequest, VercelResponse } from '@vercel/node'

// Tech Hub カードデータ - 11個の新しいカード
const techHubCards = [
  { id: 1, title: "最近のAI事情・活用法", description: "AIの最新動向や実際の活用方法などAIについてざっくばらんに話しましょう" },
  { id: 2, title: "今の案件の不満", description: "現在携わっているプロジェクトで困っていることなどなど" },
  { id: 3, title: "おすすめのツール・ガジェット", description: "最近使っているおすすめのツールやガジェットはありますか？" },
  { id: 4, title: "現場の謎ルール", description: "職場にある理解しがたいルールや慣習はありますか？" },
  { id: 5, title: "最近ハマっていること", description: "今一番興味を持って取り組んでいることは何ですか？技術以外のことでもなんでもOK！" },
  { id: 6, title: "情報のキャッチアップの仕方", description: "技術情報をどのように収集していますか？" },
  { id: 7, title: "いま個人的に取り組んでいること", description: "プライベートで進めているプロジェクトや学習はありますか？" },
  { id: 8, title: "得意分野", description: "自分の強みや得意な技術領域について教えてください" },
  { id: 9, title: "最近の失敗談、やらかし", description: "最近経験した失敗やミスから学んだことはありますか？" },
  { id: 10, title: "興味を持っている分野、技術", description: "今後学んでみたい技術や分野はありますか？" },
  { id: 11, title: "キャリアについて", description: "将来のキャリアプランや目標について聞かせてください" }
]

// Game state - in production this should use a database
let gameState = {
  availableCards: [...techHubCards],
  usedCards: [],
  currentCard: null,
  isDrawing: false,
  participants: 0
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { url } = req
  
  // API routes
  if (url?.startsWith('/api/state')) {
    return res.json(gameState)
  }
  
  if (url?.startsWith('/api/draw')) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
    
    if (gameState.isDrawing) {
      return res.status(400).json({ error: '現在カードを引いています。しばらくお待ちください。' })
    }

    const filteredCards = gameState.availableCards

    if (filteredCards.length === 0) {
      return res.status(400).json({ error: '利用可能なカードがありません！' })
    }

    // Draw a random card
    const randomIndex = Math.floor(Math.random() * filteredCards.length)
    const drawnCard = filteredCards[randomIndex]

    // Update game state
    gameState.availableCards = gameState.availableCards.filter(card => card.id !== drawnCard.id)
    gameState.usedCards.push(drawnCard)
    gameState.currentCard = drawnCard
    
    return res.json({ 
      success: true, 
      card: drawnCard, 
      gameState 
    })
  }
  
  if (url?.startsWith('/api/reset')) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
    
    gameState = {
      availableCards: [...techHubCards],
      usedCards: [],
      currentCard: null,
      isDrawing: false,
      participants: gameState.participants
    }
    
    return res.json({ success: true, message: 'ゲームをリセットしました' })
  }

  if (url?.startsWith('/api/qr')) {
    // For Vercel deployment, return the current domain
    const host = req.headers.host || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`
    
    // Simple QR code data URL (you may want to use qrcode library here)
    const qrCodeData = `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12" fill="black">
          QR Code: ${baseUrl}
        </text>
      </svg>
    `).toString('base64')}`
    
    return res.json({
      url: baseUrl,
      qrCode: qrCodeData,
      ip: host,
      port: 443
    })
  }
  
  // API only - no HTML serving
  
  return res.status(404).json({ error: 'Not found' })
}