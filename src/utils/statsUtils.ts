import { GameState, PlayerColor } from '../types/game';
import { GameStats, GameHistory } from '../types/stats';

const STATS_KEY = 'squares_game_stats';
const HISTORY_KEY = 'squares_game_history';

export const getInitialStats = (): GameStats => ({
  totalGames: 0,
  wins: {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0
  },
  highScores: {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0
  },
  averageScore: {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0
  },
  totalBlocksPlaced: {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0
  }
});

export const loadStats = (): GameStats => {
  const statsJson = localStorage.getItem(STATS_KEY);
  return statsJson ? JSON.parse(statsJson) : getInitialStats();
};

export const loadHistory = (): GameHistory[] => {
  const historyJson = localStorage.getItem(HISTORY_KEY);
  return historyJson ? JSON.parse(historyJson) : [];
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const saveHistory = (history: GameHistory[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const updateGameStats = (gameState: GameState) => {
  const stats = loadStats();
  const history = loadHistory();
  
  // 更新總遊戲數
  stats.totalGames++;
  
  // 計算每個玩家的分數
  const scores: Record<PlayerColor, number> = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0
  };
  
  gameState.players.forEach(player => {
    const color = player.color;
    const score = player.placedBlocks.reduce((total, block) => 
      total + block.shape.reduce((rowTotal, row) => 
        rowTotal + row.reduce((cellTotal, cell) => cellTotal + (cell ? 1 : 0), 0), 0), 0);
    
    scores[color] = score;
    
    // 更新最高分
    if (score > stats.highScores[color]) {
      stats.highScores[color] = score;
    }
    
    // 更新平均分
    const totalScore = stats.averageScore[color] * stats.totalBlocksPlaced[color] + score;
    stats.totalBlocksPlaced[color] += player.placedBlocks.length;
    stats.averageScore[color] = totalScore / stats.totalBlocksPlaced[color];
  });
  
  // 更新獲勝次數
  if (gameState.winner) {
    stats.wins[gameState.winner]++;
  }
  
  // 添加遊戲歷史記錄
  const historyEntry: GameHistory = {
    date: new Date().toISOString(),
    winner: gameState.winner!,
    scores,
    playerCount: gameState.players.length
  };
  
  history.push(historyEntry);
  if (history.length > 10) {
    history.shift(); // 只保留最近10場遊戲的記錄
  }
  
  saveStats(stats);
  saveHistory(history);
  
  return { stats, history };
}; 