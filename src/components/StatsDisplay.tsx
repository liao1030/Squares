import React from 'react';
import { GameStats, GameHistory } from '../types/stats';
import { PlayerColor } from '../types/game';

interface StatsDisplayProps {
  stats: GameStats;
  history: GameHistory[];
  onClose: () => void;
  playerColorMap: Record<PlayerColor, string>;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  history,
  onClose,
  playerColorMap
}) => {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '20px auto',
      textAlign: 'left'
    }}>
      <h2>遊戲統計</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>總體統計</h3>
        <p>總遊戲場數：{stats.totalGames}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>玩家統計</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}>
          {Object.entries(playerColorMap).map(([color, name]) => (
            <div
              key={color}
              style={{
                padding: '10px',
                border: `2px solid ${color}`,
                borderRadius: '4px'
              }}
            >
              <h4 style={{ color: color, margin: '0 0 10px 0' }}>{name}</h4>
              <p>獲勝次數：{stats.wins[color as PlayerColor]}</p>
              <p>最高分：{stats.highScores[color as PlayerColor]}</p>
              <p>平均分：{stats.averageScore[color as PlayerColor].toFixed(1)}</p>
              <p>已放置方塊：{stats.totalBlocksPlaced[color as PlayerColor]}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>最近遊戲記錄</h3>
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px'
        }}>
          {history.map((game, index) => (
            <div
              key={index}
              style={{
                padding: '10px',
                borderBottom: index < history.length - 1 ? '1px solid #eee' : 'none'
              }}
            >
              <p>
                日期：{new Date(game.date).toLocaleString()}
                <br />
                獲勝者：<span style={{ color: game.winner }}>{playerColorMap[game.winner]}</span>
                <br />
                玩家數：{game.playerCount}
              </p>
              <div style={{ fontSize: '14px', color: '#666' }}>
                分數：
                {Object.entries(game.scores).map(([color, score]) => (
                  <span key={color} style={{ marginRight: '10px', color }}>
                    {playerColorMap[color as PlayerColor]}: {score}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
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
};

export default StatsDisplay; 