import { useState, useEffect } from 'react'
import type { GameState } from '../types'

interface AdminPanelProps {
  gameState: GameState
  participants: number
  onReset: () => void
}

interface QRData {
  url: string
  qrCode: string
  ip: string
  port: number
}

export const AdminPanel = ({ gameState, participants, onReset }: AdminPanelProps) => {
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadQRCode = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/qr')
      
      if (response.ok) {
        const data = await response.json()
        setQrData(data)
      } else {
        console.error('QRコード取得失敗:', response.status, response.statusText)
        setQrData(null)
      }
    } catch (error) {
      console.error('QRコード読み込みエラー:', error)
      setQrData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQRCode()
    // 5分ごとにQRコードを自動更新
    const interval = setInterval(loadQRCode, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const difficultyLabels = {
    initial: '初級',
    intermediate: '中級',
    advanced: '上級'
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔧 Tech Hub トークカード管理画面</h1>
        <p>参加者がスマホでQRコードを読み取ってカードを引けます</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card qr-section">
          <h2>📱 参加者用QRコード</h2>
          <div className="qr-code-container">
            {loading ? (
              <div className="qr-loading">QRコード生成中...</div>
            ) : qrData ? (
              <img src={qrData.qrCode} alt="QRコード" className="qr-code" />
            ) : (
              <div className="qr-error">QRコード生成エラー</div>
            )}
          </div>
          {qrData && (
            <div className="url-info">
              <strong>アクセスURL:</strong><br />
              <span>{qrData.url}</span>
            </div>
          )}
          <div className="instructions">
            <h4>🎯 使い方</h4>
            <ol>
              <li>参加者にQRコードをスキャンしてもらう</li>
              <li>各自のスマホでカードを引いてもらう</li>
              <li>引いたテーマで5〜10分トークタイム！</li>
            </ol>
          </div>
        </div>

        <div className="admin-card status-section">
          <h2>⚡ サーバー状態</h2>
          <div className="status-indicator connected">
            <span>🟢</span>
            <span>サーバー稼働中</span>
          </div>
          
          {qrData && (
            <div className="network-info">
              <h4>ネットワーク情報</h4>
              <div className="network-item">
                <span>IPアドレス:</span>
                <span>{qrData.ip}</span>
              </div>
              <div className="network-item">
                <span>ポート:</span>
                <span>{qrData.port}</span>
              </div>
              <div className="network-item">
                <span>参加者:</span>
                <span>{participants}人</span>
              </div>
            </div>
          )}

          <div className="quick-access">
            <a href="/" className="quick-btn" target="_blank" rel="noopener noreferrer">
              参加者画面を開く
            </a>
            <button onClick={loadQRCode} className="quick-btn">
              QR更新
            </button>
            <button 
              onClick={() => {
                if (confirm('ゲームをリセットしますか？')) {
                  onReset()
                }
              }} 
              className="quick-btn reset-btn"
            >
              ゲームリセット
            </button>
          </div>
        </div>
      </div>

      {/* Current Card Display */}
      {gameState.currentCard && (
        <div className="admin-card current-card-section">
          <h2>🎯 現在のカード</h2>
          <div className="current-card-display">
            <div className="card-info">
              <h3>{gameState.currentCard?.title || 'No Title'}</h3>
              <p>{gameState.currentCard?.description || 'No Description'}</p>
              <div className="card-meta">
                <span className="category">{gameState.currentCard?.category || 'Unknown'}</span>
                <span className="difficulty">
                  {difficultyLabels[gameState.currentCard?.difficulty as keyof typeof difficultyLabels] || gameState.currentCard?.difficulty || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <h2>📊 イベント用Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🎪 イベント進行</h4>
            <ul>
              <li>QRコードをプロジェクターで投影</li>
              <li>参加者全員がアクセスできるまで待機</li>
              <li>一斉にカードを引いてもらう</li>
              <li>順番にトークタイム開始</li>
            </ul>
          </div>
          <div className="tip-card">
            <h4>⚡ リアルタイム機能</h4>
            <ul>
              <li>スマホで引いたカードがPC画面に即座に反映</li>
              <li>参加者数をリアルタイム表示</li>
              <li>WebSocket通信で低遅延</li>
              <li>同時接続: 制限なし</li>
            </ul>
          </div>
          <div className="tip-card">
            <h4>🔧 技術仕様</h4>
            <ul>
              <li>TypeScript + React</li>
              <li>Socket.IO WebSocket</li>
              <li>レスポンシブ対応</li>
              <li>型安全な実装</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}