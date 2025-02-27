import React from 'react';
import { GameStats, GameHistory } from '../types/stats';
import { PlayerColor } from '../types/game';

interface StatsDisplayProps {
  stats: GameStats;
  history: GameHistory[];
  onClose: () => void;
  playerColorMap: Record<PlayerColor, string>;
  isMobile?: boolean;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  history,
  onClose,
  playerColorMap,
  isMobile = false
}) => {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: isMobile ? '10px auto' : '20px auto',
      textAlign: 'left'
    }}>
      <h2 style={{ fontSize: isMobile ? '20px' : '24px' }}>遊戲統計</h2>
      
      <div style={{ marginBottom: isMobile ? '15px' : '20px' }}>
        <h3 style={{ fontSize: isMobile ? '18px' : '20px' }}>總體統計</h3>
        <p style={{ fontSize: isMobile ? '14px' : '16px' }}>總遊戲場數：{stats.totalGames}</p>
      </div>

      <div style={{ marginBottom: isMobile ? '15px' : '20px' }}>
        <h3 style={{ fontSize: isMobile ? '18px' : '20px' }}>玩家統計</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? '8px' : '10px'
        }}>
          {Object.entries(playerColorMap).map(([color, name]) => (
            <div
              key={color}
              style={{
                padding: isMobile ? '8px' : '10px',
                border: `2px solid ${color}`,
                borderRadius: '4px'
              }}
            >
              <h4 style={{ color: color, margin: '0 0 10px 0', fontSize: isMobile ? '16px' : '18px' }}>{name}</h4>
              <p style={{ fontSize: isMobile ? '13px' : '14px', margin: '5px 0' }}>獲勝次數：{stats.wins[color as PlayerColor]}</p>
              <p style={{ fontSize: isMobile ? '13px' : '14px', margin: '5px 0' }}>最高分：{stats.highScores[color as PlayerColor]}</p>
              <p style={{ fontSize: isMobile ? '13px' : '14px', margin: '5px 0' }}>平均分：{stats.averageScore[color as PlayerColor].toFixed(1)}</p>
              <p style={{ fontSize: isMobile ? '13px' : '14px', margin: '5px 0' }}>已放置方塊：{stats.totalBlocksPlaced[color as PlayerColor]}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: isMobile ? '15px' : '20px' }}>
        <h3 style={{ fontSize: isMobile ? '18px' : '20px' }}>最近遊戲記錄</h3>
        <div style={{
          maxHeight: isMobile ? '150px' : '200px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: isMobile ? '8px' : '10px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontSize: isMobile ? '13px' : '14px' }}>
              尚無遊戲記錄
            </p>
          ) : (
            history.map((game, index) => (
              <div
                key={index}
                style={{
                  padding: isMobile ? '8px' : '10px',
                  borderBottom: index < history.length - 1 ? '1px solid #eee' : 'none',
                  fontSize: isMobile ? '13px' : '14px'
                }}
              >
                <p style={{ margin: '0 0 5px 0' }}>
                  日期：{new Date(game.date).toLocaleString()}
                  <br />
                  獲勝者：<span style={{ color: game.winner }}>{playerColorMap[game.winner]}</span>
                  <br />
                  玩家數：{game.playerCount}
                </p>
                <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#666' }}>
                  分數：
                  {Object.entries(game.scores).map(([color, score]) => (
                    <span key={color} style={{ marginRight: '10px', color }}>
                      {playerColorMap[color as PlayerColor]}: {score}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          padding: isMobile ? '12px 20px' : '10px 20px',
          fontSize: isMobile ? '14px' : '16px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#4CAF50',
          color: 'white',
          cursor: 'pointer',
          width: isMobile ? '100%' : 'auto'
        }}
      >
        返回遊戲
      </button>
    </div>
  );
};

export default StatsDisplay; 