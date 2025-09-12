import { useState } from 'react'
import type { GameState, CategoryInfo, DifficultyInfo } from '../types'

interface ControlsProps {
  gameState: GameState
  onDrawCard: (filters?: { category?: string; difficulty?: string }) => void
  onReset: () => void
  categories: Record<string, CategoryInfo>
  difficulties: Record<string, DifficultyInfo>
}

export const Controls = ({ gameState, onDrawCard, onReset, categories, difficulties }: ControlsProps) => {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')

  const handleDrawCard = () => {
    const filters = {
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      difficulty: difficultyFilter === 'all' ? undefined : difficultyFilter
    }
    onDrawCard(filters)
  }

  const getFilteredCount = () => {
    let filtered = gameState.availableCards
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(card => card.category === categoryFilter)
    }
    
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(card => card.difficulty === difficultyFilter)
    }
    
    return filtered.length
  }

  const filteredCount = getFilteredCount()
  const difficultyLabels = {
    initial: '初級',
    intermediate: '中級',
    advanced: '上級'
  }

  return (
    <div className="controls">
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="categoryFilter">カテゴリ:</label>
          <select 
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">すべてのカテゴリ</option>
            {Object.entries(categories).map(([category, info]) => (
              <option key={category} value={category}>
                {info.icon} {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="difficultyFilter">難易度:</label>
          <select 
            id="difficultyFilter"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">すべての難易度</option>
            {Object.entries(difficulties).map(([difficulty]) => (
              <option key={difficulty} value={difficulty}>
                {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="btn btn-primary"
          onClick={handleDrawCard}
          disabled={gameState.isDrawing || filteredCount === 0}
        >
          {gameState.isDrawing ? '引いています...' : 
           filteredCount === 0 ? '該当カードなし' : 'カードを引く'}
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