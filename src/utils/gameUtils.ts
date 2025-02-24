import { Block, GameState, PlacementValidation, PlayerColor, Point, Player } from '../types/game';

export const BOARD_SIZE = 20;
export const INITIAL_BLOCKS: boolean[][][] = [
  [[true]], // 1x1
  [[true, true]], // 2x1
  [[true, true, true]], // 3x1
  [[true, true, true, true]], // 4x1
  [[true, true], [true, true]], // 2x2
  [[true, true, true], [true, false, false]], // L形
  [[true, true], [false, true], [false, true]], // L形旋轉
  [[true, true, true], [false, true, false]], // T形
  [[true, false], [true, true], [true, false]], // 十字形
  // ... 更多形狀
];

// 旋轉方塊（順時針90度）
export const rotateBlock = (block: Block): Block => {
  const height = block.shape.length;
  const width = block.shape[0].length;
  const newShape = Array(width).fill(null).map(() => Array(height).fill(false));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      newShape[x][height - 1 - y] = block.shape[y][x];
    }
  }

  return {
    shape: newShape,
    color: block.color
  };
};

// 計算單個方塊的得分（計算true的數量）
const calculateBlockScore = (block: Block): number => {
  return block.shape.reduce((score, row) => 
    score + row.reduce((rowScore, cell) => 
      rowScore + (cell ? 1 : 0), 0), 0);
};

// 計算玩家的總得分
export const calculateScore = (player: Player): number => {
  return player.placedBlocks.reduce((total, block) => 
    total + calculateBlockScore(block), 0);
};

const isCornerPosition = (position: Point): boolean => {
  return (
    (position.x === 0 && position.y === 0) || // 左上角
    (position.x === BOARD_SIZE - 1 && position.y === 0) || // 右上角
    (position.x === 0 && position.y === BOARD_SIZE - 1) || // 左下角
    (position.x === BOARD_SIZE - 1 && position.y === BOARD_SIZE - 1) // 右下角
  );
};

export const createInitialGameState = (numPlayers: number): GameState => {
  const colors: PlayerColor[] = ['red' as PlayerColor, 'blue' as PlayerColor, 'green' as PlayerColor, 'yellow' as PlayerColor].slice(0, numPlayers);
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
  const players = colors.map(color => ({
    color,
    blocks: INITIAL_BLOCKS.map(shape => ({ shape, color })),
    placedBlocks: []
  }));

  return {
    board,
    players,
    currentPlayerIndex: 0,
    gameOver: false,
    winner: null
  };
};

export const isValidPlacement = (
  state: GameState,
  block: Block,
  position: Point
): PlacementValidation => {
  const { board, players, currentPlayerIndex } = state;
  const currentPlayer = players[currentPlayerIndex];

  // 檢查是否在棋盤範圍內
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x]) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        
        if (boardY < 0 || boardY >= BOARD_SIZE || boardX < 0 || boardX >= BOARD_SIZE) {
          return { isValid: false, message: '方塊超出棋盤範圍！' };
        }
        
        if (board[boardY][boardX] !== null) {
          return { isValid: false, message: '此位置已被佔用！' };
        }
      }
    }
  }

  // 檢查首次放置是否在角落
  if (currentPlayer.placedBlocks.length === 0) {
    let coversCorner = false;
    for (let y = 0; y < block.shape.length; y++) {
      for (let x = 0; x < block.shape[y].length; x++) {
        if (block.shape[y][x]) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (isCornerPosition({ x: boardX, y: boardY })) {
            coversCorner = true;
            break;
          }
        }
      }
      if (coversCorner) break;
    }
    
    if (!coversCorner) {
      return { isValid: false, message: '第一個方塊必須覆蓋棋盤的某個角落！' };
    }
    
    return { isValid: true };
  }

  // 檢查是否與同色方塊相鄰
  let hasCornerConnection = false;
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x]) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        
        // 檢查四個邊
        const adjacentPositions = [
          { x: boardX - 1, y: boardY },
          { x: boardX + 1, y: boardY },
          { x: boardX, y: boardY - 1 },
          { x: boardX, y: boardY + 1 }
        ];

        for (const pos of adjacentPositions) {
          if (pos.x >= 0 && pos.x < BOARD_SIZE && pos.y >= 0 && pos.y < BOARD_SIZE) {
            if (board[pos.y][pos.x] === currentPlayer.color) {
              return { isValid: false, message: '不能與同色方塊相鄰！' };
            }
          }
        }

        // 檢查四個角
        const cornerPositions = [
          { x: boardX - 1, y: boardY - 1 },
          { x: boardX + 1, y: boardY - 1 },
          { x: boardX - 1, y: boardY + 1 },
          { x: boardX + 1, y: boardY + 1 }
        ];

        for (const pos of cornerPositions) {
          if (pos.x >= 0 && pos.x < BOARD_SIZE && pos.y >= 0 && pos.y < BOARD_SIZE) {
            if (board[pos.y][pos.x] === currentPlayer.color) {
              hasCornerConnection = true;
            }
          }
        }
      }
    }
  }

  if (!hasCornerConnection) {
    return { isValid: false, message: '必須與同色方塊角對角相連！' };
  }

  return { isValid: true };
};

export const placeBlock = (
  state: GameState,
  block: Block,
  position: Point
): GameState => {
  const newState = JSON.parse(JSON.stringify(state));
  const { board, players, currentPlayerIndex } = newState;

  // 放置方塊
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x]) {
        board[position.y + y][position.x + x] = block.color;
      }
    }
  }

  // 更新玩家狀態
  const currentPlayer = players[currentPlayerIndex];
  const blockIndex = currentPlayer.blocks.findIndex((b: Block) => 
    JSON.stringify(b.shape) === JSON.stringify(block.shape)
  );
  
  if (blockIndex !== -1) {
    currentPlayer.blocks.splice(blockIndex, 1);
    currentPlayer.placedBlocks.push(block);
  }

  // 更新當前玩家
  newState.currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

  return newState;
}; 