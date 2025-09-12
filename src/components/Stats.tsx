import type { GameState } from '../types'

interface StatsProps {
  gameState: GameState
  participants: number
}

export const Stats = ({ gameState, participants }: StatsProps) => {
  return (
    <div className="stats">
      <div className="stat-item">
        <span className="stat-label">残り:</span>
        <span className="stat-value">{gameState.availableCards.length}</span>枚
      </div>
      <div className="stat-item">
        <span className="stat-label">使用済み:</span>
        <span className="stat-value">{gameState.usedCards.length}</span>枚
      </div>
      <div className="stat-item">
        <span className="stat-label">参加者:</span>
        <span className="stat-value">{participants}</span>人
      </div>
    </div>
  )
}