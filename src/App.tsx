import { useState } from 'react'
import './App.css'
import Board from './components/Board'
import BlockSelector from './components/BlockSelector'
import { Block, GameState, Point } from './types/game'
import { createInitialGameState, isValidPlacement, placeBlock, calculateScore, rotateBlock } from './utils/gameUtils'

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [message, setMessage] = useState<string>('')

  const handlePlayerCountSelect = (count: number) => {
    setGameState(createInitialGameState(count))
    setMessage('')
  }

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block)
    setMessage('')
  }

  const handleRotateBlock = () => {
    if (selectedBlock) {
      setSelectedBlock(rotateBlock(selectedBlock))
    }
  }

  const handleCellClick = (position: Point) => {
    if (!gameState || !selectedBlock) {
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

  const playerColorMap = {
    'red': '紅色',
    'blue': '藍色',
    'green': '綠色',
    'yellow': '黃色'
  }

  if (!gameState) {
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
          <h2>請選擇玩家人數</h2>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginTop: '20px'
          }}>
            {[2, 3, 4].map(count => (
              <button
                key={count}
                onClick={() => handlePlayerCountSelect(count)}
                style={{
                  padding: '10px 20px',
                  fontSize: '18px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {count} 人遊戲
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex]

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
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '800px'
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
        <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          {currentPlayer.placedBlocks.length === 0 ? 
            '請將第一個方塊放在棋盤的任一角落' : 
            '方塊必須與同色方塊角對角相連，且不能邊對邊相鄰'}
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
          提示：選擇方塊後可以點擊旋轉按鈕進行旋轉
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          {gameState.players.map((player, index) => (
            <div
              key={player.color}
              style={{
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: index === gameState.currentPlayerIndex ? '#fff' : 'transparent',
                border: `2px solid ${player.color}`,
                minWidth: '120px'
              }}
            >
              <div style={{ color: player.color, fontWeight: 'bold' }}>
                {playerColorMap[player.color]}
              </div>
              <div style={{ marginTop: '5px' }}>
                得分：{calculateScore(player)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                剩餘方塊：{player.blocks.length}
              </div>
            </div>
          ))}
        </div>
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
            onRotateBlock={handleRotateBlock}
          />
        </div>
      </div>
    </div>
  )
}

export default App
