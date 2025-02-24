export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';

export interface Point {
  x: number;
  y: number;
}

export interface Block {
  shape: boolean[][];
  color: PlayerColor;
}

export interface Player {
  color: PlayerColor;
  blocks: Block[];
  placedBlocks: Block[];
}

export interface GameState {
  board: (PlayerColor | null)[][];
  players: Player[];
  currentPlayerIndex: number;
  gameOver: boolean;
  winner: PlayerColor | null;
}

export type PlacementValidation = {
  isValid: boolean;
  message?: string;
}; 