import { PlayerColor } from './game';

export interface GameStats {
  totalGames: number;
  wins: Record<PlayerColor, number>;
  highScores: Record<PlayerColor, number>;
  averageScore: Record<PlayerColor, number>;
  totalBlocksPlaced: Record<PlayerColor, number>;
}

export interface GameHistory {
  date: string;
  winner: PlayerColor;
  scores: Record<PlayerColor, number>;
  playerCount: number;
} 