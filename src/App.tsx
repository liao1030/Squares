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
  const [showRules, setShowRules] = useState(false)

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

  const handleRestart = () => {
    setGameState(null)
    setSelectedBlock(null)
    setMessage('')
    setShowRules(false)
  }

  const playerColorMap = {
    'red': '紅色',
    'blue': '藍色',
    'green': '綠色',
    'yellow': '黃色'
  }

  const Rules = () => (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '20px auto',
      textAlign: 'left'
    }}>
      <h2>遊戲規則</h2>
      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <h3>遊戲目標</h3>
        <p>將自己的所有方塊盡可能地放置在棋盤上，阻止對手，同時為自己創造更多的擺放空間。遊戲結束時，未能放置的方塊數量最少的玩家獲勝。</p>
        
        <h3>基本規則</h3>
        <ul>
          <li>每位玩家輪流放置方塊</li>
          <li>第一個方塊必須放在棋盤的四個角落之一</li>
          <li>後續放置的方塊必須：
            <ul>
              <li>與同色方塊角對角相連（即僅在角上接觸）</li>
              <li>不能與同色方塊邊對邊相連</li>
            </ul>
          </li>
          <li>可以使用旋轉按鈕來旋轉方塊</li>
        </ul>

        <h3>遊戲結束</h3>
        <ul>
          <li>當某位玩家成功放置所有方塊時</li>
          <li>或當所有玩家都無法繼續放置方塊時</li>
        </ul>

        <h3>計分方式</h3>
        <p>每個方塊的得分等於它所佔的格子數量，玩家的總得分是所有已放置方塊的得分總和。</p>
      </div>
      <button
        onClick={() => setShowRules(false)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#4CAF50',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        返回遊戲
      </button>
    </div>
  );

  if (showRules) {
    return (
      <div className="App" style={{
        padding: '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      }}>
        <Rules />
      </div>
    );
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
          <button
            onClick={() => setShowRules(true)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#2196F3',
              color: 'white',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            查看遊戲規則
          </button>
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
        {gameState.gameOver ? (
          <div>
            <h2 style={{ color: gameState.winner }}>
              遊戲結束！{playerColorMap[gameState.winner!]}獲勝！
            </h2>
            <button
              onClick={handleRestart}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#4CAF50',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              重新開始
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}

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

        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setShowRules(true)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#2196F3',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            查看規則
          </button>
          <button
            onClick={handleRestart}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#f44336',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            重新開始
          </button>
        </div>
      </div>

      {!gameState.gameOver && (
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
            <Board 
              gameState={gameState} 
              onCellClick={handleCellClick}
              selectedBlock={selectedBlock}
            />
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
      )}
    </div>
  )
}

export default App
