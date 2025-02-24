import React from 'react';
import { GameState, Point } from '../types/game';
import { BOARD_SIZE } from '../utils/gameUtils';

interface BoardProps {
  gameState: GameState;
  onCellClick: (position: Point) => void;
}

const Board: React.FC<BoardProps> = ({ gameState, onCellClick }) => {
  return (
    <div className="board" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${BOARD_SIZE}, 25px)`,
      gap: '1px',
      backgroundColor: '#ccc',
      padding: '10px',
      borderRadius: '4px'
    }}>
      {Array(BOARD_SIZE).fill(null).map((_, y) =>
        Array(BOARD_SIZE).fill(null).map((_, x) => {
          const color = gameState.board[y][x];
          return (
            <div
              key={`${x}-${y}`}
              style={{
                width: '25px',
                height: '25px',
                backgroundColor: color || '#fff',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
              onClick={() => onCellClick({ x, y })}
            />
          );
        })
      )}
    </div>
  );
};

export default Board; 