import { VercelRequest, VercelResponse } from '@vercel/node'
import { techHubCards } from '../shared/cards.js'

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
  
  // Serve static files - redirect to main page
  if (url === '/' || url === '/admin' || !url?.includes('.')) {
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💻 Tech Hub トークカード</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            color: white; text-align: center;
        }
        .container { max-width: 600px; }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .card { 
            background: white; color: #333; padding: 30px; border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin: 20px 0;
        }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; flex: 1; margin: 0 10px; }
        button {
            background: #4CAF50; color: white; border: none; padding: 15px 30px;
            border-radius: 25px; font-size: 1.1rem; cursor: pointer; margin: 10px;
            transition: all 0.3s ease;
        }
        button:hover { background: #45a049; transform: translateY(-2px); }
        .admin-link { 
            display: inline-block; margin-top: 20px; color: rgba(255,255,255,0.8);
            text-decoration: none; font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💻 Tech Hub トークカード</h1>
        <p>エンジニア交流イベント用トークテーマ抽選システム</p>
        
        <div class="card">
            <h2>全11種類のトークテーマ</h2>
            <div class="stats">
                <div class="stat">
                    <div>残り</div>
                    <div id="available">11</div>
                </div>
                <div class="stat">
                    <div>使用済み</div>
                    <div id="used">0</div>
                </div>
            </div>
            <button onclick="drawCard()">カードを引く</button>
            <button onclick="resetGame()">リセット</button>
            <div id="current-card" style="margin-top: 20px; min-height: 80px;"></div>
        </div>
        
        <a href="/admin" class="admin-link">管理者画面へ</a>
    </div>

    <script>
        let gameState = { availableCards: [], usedCards: [], currentCard: null };
        
        async function updateState() {
            try {
                const response = await fetch('/api/state');
                gameState = await response.json();
                document.getElementById('available').textContent = gameState.availableCards.length;
                document.getElementById('used').textContent = gameState.usedCards.length;
                
                if (gameState.currentCard) {
                    document.getElementById('current-card').innerHTML = \`
                        <h3>\${gameState.currentCard.title}</h3>
                        <p>\${gameState.currentCard.description}</p>
                    \`;
                }
            } catch (err) {
                console.error('State update failed:', err);
            }
        }
        
        async function drawCard() {
            try {
                const response = await fetch('/api/draw', { method: 'POST' });
                const result = await response.json();
                if (result.success) {
                    gameState = result.gameState;
                    updateState();
                } else {
                    alert(result.error);
                }
            } catch (err) {
                alert('カードの抽選に失敗しました');
            }
        }
        
        async function resetGame() {
            if (confirm('ゲームをリセットしますか？')) {
                try {
                    await fetch('/api/reset', { method: 'POST' });
                    updateState();
                } catch (err) {
                    alert('リセットに失敗しました');
                }
            }
        }
        
        // Initialize
        updateState();
        setInterval(updateState, 2000);
    </script>
</body>
</html>`
    
    res.setHeader('Content-Type', 'text/html')
    return res.send(html)
  }
  
  return res.status(404).json({ error: 'Not found' })
}