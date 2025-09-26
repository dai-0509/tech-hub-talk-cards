import { useState, useEffect } from 'react'
import { useSocket } from './hooks/useSocket'
import { CardDisplay } from './components/CardDisplay'
import { Controls } from './components/Controls'
import { Stats } from './components/Stats'
import { Message } from './components/Message'
import { AdminPanel } from './components/AdminPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import './App.css'

function App() {
  const { gameState, participants, error, drawCard, resetGame, isConnected } = useSocket()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if this is admin page
    setIsAdmin(window.location.pathname === '/admin')
  }, [])

  const handleDrawCard = () => {
    drawCard()
  }

  if (isAdmin) {
    return (
      <ErrorBoundary>
        <AdminPanel gameState={gameState} participants={participants} onReset={resetGame} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>💻 Tech Hub トークカード</h1>
          <p>エンジニア交流イベント用トークテーマ抽選システム</p>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 接続中' : '🔴 未接続'}
            </span>
          </div>
        </header>

        <Controls 
          gameState={gameState}
          onDrawCard={handleDrawCard}
          onReset={resetGame}
        />

        <Stats gameState={gameState} participants={participants} />

        {error && <Message type="error" message={error} />}

        <CardDisplay gameState={gameState} />

        <footer className="app-footer">
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App