import type { GameState } from '../types'

interface ControlsProps {
  gameState: GameState
  onDrawCard: () => void
  onReset: () => void
}

export const Controls = ({ gameState, onDrawCard, onReset }: ControlsProps) => {
  const availableCount = gameState.availableCards.length

  return (
    <div className="controls">
      <div className="action-buttons">
        <button 
          className="btn btn-primary"
          onClick={onDrawCard}
          disabled={gameState.isDrawing || availableCount === 0}
        >
          {gameState.isDrawing ? '引いています...' : 
           availableCount === 0 ? 'カードなし' : 'カードを引く'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            if (confirm('ゲームをリセットしますか？使用したカードもリセットされます。')) {
              onReset()
            }
          }}
        >
          リセット
        </button>
      </div>
    </div>
  )
}