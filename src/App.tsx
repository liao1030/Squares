import { useState } from 'react'
import './App.css'
import Board from './components/Board'
import BlockSelector from './components/BlockSelector'
import { Block, GameState, Point } from './types/game'
import { createInitialGameState, isValidPlacement, placeBlock } from './utils/gameUtils'

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState(2))
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [message, setMessage] = useState<string>('')

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block)
    setMessage('')
  }

  const handleCellClick = (position: Point) => {
    if (!selectedBlock) {
      setMessage('請先選擇一個方塊')
      return
    }

    const validation = isValidPlacement(gameState, selectedBlock, position)
    if (!validation.isValid) {
      setMessage(validation.message || '無效的放置位置')
      return
    }

    const newState = placeBlock(gameState, selectedBlock, position)
    setGameState(newState)
    setSelectedBlock(null)
    setMessage('')
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex]

  const playerColorMap = {
    'red': '紅色',
    'blue': '藍色',
    'green': '綠色',
    'yellow': '黃色'
  }

  return (
    <div className="App" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      gap: '20px',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1>心柔宇新_玩方塊遊戲</h1>
      
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: currentPlayer.color }}>
          目前玩家：{playerColorMap[currentPlayer.color]}
        </h2>
        {message && (
          <div style={{
            color: 'red',
            marginBottom: '10px'
          }}>
            {message}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '20px',
        maxWidth: '1200px',
        width: '100%',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <div>
          <h3>遊戲棋盤</h3>
          <Board gameState={gameState} onCellClick={handleCellClick} />
        </div>
        
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h3>可用方塊</h3>
          <BlockSelector
            blocks={currentPlayer.blocks}
            selectedBlock={selectedBlock}
            onBlockSelect={handleBlockSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default App
