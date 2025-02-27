import { useState, useEffect } from 'react'
import './App.css'
import Board from './components/Board'
import BlockSelector from './components/BlockSelector'
import StatsDisplay from './components/StatsDisplay'
import { Block, GameState, Point } from './types/game'
import { createInitialGameState, isValidPlacement, placeBlock, calculateScore, rotateBlock } from './utils/gameUtils'
import { playPlaceSound, playRotateSound, playGameOverSound } from './utils/soundUtils'
import { loadStats, loadHistory, updateGameStats } from './utils/statsUtils'

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [message, setMessage] = useState<string>('')
  const [showRules, setShowRules] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      playRotateSound()
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

    playPlaceSound()
    const newState = placeBlock(gameState, selectedBlock, position)
    
    if (newState.gameOver && !gameState.gameOver) {
      playGameOverSound()
      updateGameStats(newState)
    }
    
    setGameState(newState)
    setSelectedBlock(null)
    setMessage('')
  }

  const handleRestart = () => {
    setGameState(null)
    setSelectedBlock(null)
    setMessage('')
    setShowRules(false)
    setShowStats(false)
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
      padding: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '20px auto',
      textAlign: 'left'
    }}>
      <h2>遊戲規則</h2>
      <div style={{ fontSize: isMobile ? '13px' : '14px', lineHeight: '1.6' }}>
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
          fontSize: isMobile ? '14px' : '16px',
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
        padding: isMobile ? '10px' : '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      }}>
        <Rules />
      </div>
    );
  }

  if (showStats) {
    return (
      <div className="App" style={{
        padding: isMobile ? '10px' : '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      }}>
        <StatsDisplay
          stats={loadStats()}
          history={loadHistory()}
          onClose={() => setShowStats(false)}
          playerColorMap={playerColorMap}
          isMobile={isMobile}
        />
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="App" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '15px' : '20px',
        gap: isMobile ? '15px' : '20px',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0'
      }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '32px' }}>心柔宇新_玩方塊遊戲</h1>
        <div style={{
          backgroundColor: '#fff',
          padding: isMobile ? '15px' : '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ fontSize: isMobile ? '20px' : '24px' }}>請選擇玩家人數</h2>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
            justifyContent: 'center',
            marginTop: '20px'
          }}>
            {[2, 3, 4].map(count => (
              <button
                key={count}
                onClick={() => handlePlayerCountSelect(count)}
                style={{
                  padding: isMobile ? '12px 20px' : '10px 20px',
                  fontSize: isMobile ? '16px' : '18px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {count} 人遊戲
              </button>
            ))}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
            marginTop: '20px'
          }}>
            <button
              onClick={() => setShowRules(true)}
              style={{
                padding: isMobile ? '12px 20px' : '10px 20px',
                fontSize: isMobile ? '14px' : '16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#2196F3',
                color: 'white',
                cursor: 'pointer',
                flex: 1
              }}
            >
              查看規則
            </button>
            <button
              onClick={() => setShowStats(true)}
              style={{
                padding: isMobile ? '12px 20px' : '10px 20px',
                fontSize: isMobile ? '14px' : '16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#FF9800',
                color: 'white',
                cursor: 'pointer',
                flex: 1
              }}
            >
              遊戲統計
            </button>
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
      padding: isMobile ? '10px' : '20px',
      gap: isMobile ? '10px' : '20px',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{ fontSize: isMobile ? '24px' : '32px', margin: isMobile ? '10px 0' : '20px 0' }}>心柔宇新_玩方塊遊戲</h1>
      
      <div style={{
        backgroundColor: '#fff',
        padding: isMobile ? '10px' : '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '800px'
      }}>
        {gameState.gameOver ? (
          <div>
            <h2 style={{ color: gameState.winner, fontSize: isMobile ? '20px' : '24px' }}>
              遊戲結束！{playerColorMap[gameState.winner!]}獲勝！
            </h2>
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              marginTop: '20px',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <button
                onClick={handleRestart}
                style={{
                  padding: isMobile ? '12px 20px' : '10px 20px',
                  fontSize: isMobile ? '14px' : '16px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                重新開始
              </button>
              <button
                onClick={() => setShowStats(true)}
                style={{
                  padding: isMobile ? '12px 20px' : '10px 20px',
                  fontSize: isMobile ? '14px' : '16px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                查看統計
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ color: currentPlayer.color, fontSize: isMobile ? '20px' : '24px' }}>
              目前玩家：{playerColorMap[currentPlayer.color]}
            </h2>
            {message && (
              <div style={{
                color: 'red',
                marginBottom: '10px',
                fontSize: isMobile ? '14px' : '16px',
                padding: '5px',
                backgroundColor: '#ffebee',
                borderRadius: '4px'
              }}>
                {message}
              </div>
            )}
            <div style={{ fontSize: isMobile ? '13px' : '14px', color: '#666', marginTop: '10px' }}>
              {currentPlayer.placedBlocks.length === 0 ? 
                '請將第一個方塊放在棋盤的任一角落' : 
                '方塊必須與同色方塊角對角相連，且不能邊對邊相鄰'}
            </div>
            <div style={{ fontSize: isMobile ? '13px' : '14px', color: '#666', marginTop: '5px' }}>
              提示：選擇方塊後可以點擊旋轉按鈕進行旋轉
            </div>
          </>
        )}

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-around',
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          gap: isMobile ? '10px' : '0'
        }}>
          {gameState.players.map((player, index) => (
            <div
              key={player.color}
              style={{
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: index === gameState.currentPlayerIndex ? '#fff' : 'transparent',
                border: `2px solid ${player.color}`,
                minWidth: isMobile ? '100%' : '120px'
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
          justifyContent: 'center',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <button
            onClick={() => setShowRules(true)}
            style={{
              padding: isMobile ? '12px 16px' : '8px 16px',
              fontSize: isMobile ? '14px' : '14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#2196F3',
              color: 'white',
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            查看規則
          </button>
          <button
            onClick={() => setShowStats(true)}
            style={{
              padding: isMobile ? '12px 16px' : '8px 16px',
              fontSize: isMobile ? '14px' : '14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#FF9800',
              color: 'white',
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            查看統計
          </button>
          <button
            onClick={handleRestart}
            style={{
              padding: isMobile ? '12px 16px' : '8px 16px',
              fontSize: isMobile ? '14px' : '14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#f44336',
              color: 'white',
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            重新開始
          </button>
        </div>
      </div>

      {!gameState.gameOver && (
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '10px' : '20px',
          maxWidth: '1200px',
          width: '100%',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: isMobile ? '18px' : '20px', margin: isMobile ? '10px 0' : '15px 0' }}>遊戲棋盤</h3>
            <div style={{
              overflowX: 'auto',
              padding: isMobile ? '10px' : '0',
              maxWidth: '100%',
              WebkitOverflowScrolling: 'touch' // 提升 iOS 滾動體驗
            }}>
              <Board 
                gameState={gameState} 
                onCellClick={handleCellClick}
                selectedBlock={selectedBlock}
                isMobile={isMobile}
              />
            </div>
          </div>
          
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : '300px' }}>
            <h3 style={{ fontSize: isMobile ? '18px' : '20px', margin: isMobile ? '10px 0' : '15px 0' }}>可用方塊</h3>
            <BlockSelector
              blocks={currentPlayer.blocks}
              selectedBlock={selectedBlock}
              onBlockSelect={handleBlockSelect}
              onRotateBlock={handleRotateBlock}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
