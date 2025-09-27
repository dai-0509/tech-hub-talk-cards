import { useRef } from 'react'
import type { GameState } from '../types'

interface CardDisplayProps {
  gameState: GameState
}

export const CardDisplay = ({ gameState }: CardDisplayProps) => {
  const cardContainerRef = useRef<HTMLDivElement>(null)

  // 自動スクロールを無効化（画面内表示を優先）
  if (gameState.isDrawing) {
    return (
      <div className="card-container">
        <div className="card-animation">
          <div className="spinning-card">
            <div className="card-back">
              <div className="card-pattern"></div>
              <h3>Tech Hub</h3>
              <p>トークカード</p>
            </div>
          </div>
          <p className="draw-text">カードを引いています...</p>
        </div>
      </div>
    )
  }

  if (gameState.currentCard) {
    const card = gameState.currentCard

    return (
      <div className="card-container" ref={cardContainerRef}>
        <div className="drawn-card">
          <h2 className="card-title">{card?.title || 'No Title'}</h2>
          <p className="card-description">{card?.description || 'No Description'}</p>
          <div className="card-footer">
            <small>トークタイム: 5〜10分</small>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card-container">
      <div className="no-card">
        <h3>💻 Tech Hub トークカード 💻</h3>
        <p>「カードを引く」ボタンを押してトークテーマを選ぼう！</p>
        <div className="stats">
          <span>全11種類のトークテーマ</span>
        </div>
      </div>
    </div>
  )
}