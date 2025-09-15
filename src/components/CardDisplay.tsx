import type { GameState, CategoryInfo, DifficultyInfo } from '../types'

interface CardDisplayProps {
  gameState: GameState
  categories: Record<string, CategoryInfo>
  difficulties: Record<string, DifficultyInfo>
}

export const CardDisplay = ({ gameState, categories, difficulties }: CardDisplayProps) => {
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
    
    // Ultra-safe access with multiple fallbacks
    const categoryKey = card?.category || 'Unknown'
    const difficultyKey = card?.difficulty || 'initial'
    
    const categoryInfo = categories[categoryKey] || { 
      name: categoryKey, 
      color: '#6b7280', 
      icon: '🔹' 
    }
    const difficultyInfo = difficulties[difficultyKey] || { 
      name: difficultyKey, 
      color: '#6b7280', 
      description: '' 
    }
    const difficultyLabel = {
      initial: '初級',
      intermediate: '中級', 
      advanced: '上級'
    }[difficultyKey as keyof typeof difficultyLabel] || difficultyKey
    
    console.log('CardDisplay rendering card:', {
      card,
      categoryInfo,
      difficultyInfo,
      difficultyLabel
    })

    return (
      <div className="card-container">
        <div className="drawn-card" style={{ borderColor: categoryInfo?.color || '#6b7280' }}>
          <div className="card-header">
            <span 
              className="category-badge" 
              style={{ backgroundColor: categoryInfo?.color || '#6b7280' }}
            >
              {categoryInfo?.icon || '🔹'} {card?.category || 'Unknown'}
            </span>
            <span 
              className="difficulty-badge" 
              style={{ backgroundColor: difficultyInfo?.color || '#6b7280' }}
            >
              {difficultyLabel || 'Unknown'}
            </span>
          </div>
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
          <span>全30種類のトークテーマ</span>
        </div>
      </div>
    </div>
  )
}