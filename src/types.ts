// Type definitions - matching API structure
export interface Card {
  id: number
  title: string
  description: string
  category: string
  difficulty: 'initial' | 'intermediate' | 'advanced'
}

export interface GameState {
  availableCards: Card[]
  usedCards: Card[]
  currentCard: Card | null
  isDrawing: boolean
  participants: number
}

export interface CategoryInfo {
  name: string
  color: string
  icon: string
}

export interface DifficultyInfo {
  name: string
  color: string
  description: string
}

export interface DrawCardResponse {
  card: Card
  gameState: GameState
}

export interface SocketEvents {
  'game:join': () => void
  'game:state': (state: GameState) => void
  'card:draw': (filters?: { category?: string; difficulty?: string }) => void
  'card:drawn': (response: DrawCardResponse) => void
  'game:reset': () => void
  'participants:update': (count: number) => void
  'error': (message: string) => void
}