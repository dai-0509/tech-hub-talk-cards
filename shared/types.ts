export interface Card {
  id: number
  title: string
  description: string
  category: string
  difficulty: 'initial' | 'intermediate' | 'advanced'
}

export interface CategoryInfo {
  color: string
  icon: string
}

export interface DifficultyInfo {
  color: string
  level: number
}

export interface GameState {
  availableCards: Card[]
  usedCards: Card[]
  currentCard: Card | null
  isDrawing: boolean
  participants: number
}

export interface SocketEvents {
  // Client to Server
  'card:draw': (filters?: { category?: string; difficulty?: string }) => void
  'game:reset': () => void
  'game:join': () => void

  // Server to Client
  'card:drawn': (data: { card: Card; gameState: GameState }) => void
  'game:state': (gameState: GameState) => void
  'game:reset': () => void
  'participants:update': (count: number) => void
  'error': (message: string) => void
}

export type DrawCardResponse = {
  success: boolean
  card?: Card
  gameState?: GameState
  error?: string
}