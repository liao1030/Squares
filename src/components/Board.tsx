import React, { useState } from 'react';
import { GameState, Point, Block } from '../types/game';
import { BOARD_SIZE, isValidPlacement } from '../utils/gameUtils';

interface BoardProps {
  gameState: GameState;
  onCellClick: (position: Point) => void;
  selectedBlock: Block | null;
}

interface PreviewResult {
  cells: Set<string>;
  isValid: boolean;
}

const Board: React.FC<BoardProps> = ({ gameState, onCellClick, selectedBlock }) => {
  const [hoverPosition, setHoverPosition] = useState<Point | null>(null);

  // 計算預覽方塊的位置和顯示
  const getPreviewCells = (): PreviewResult => {
    if (!selectedBlock || !hoverPosition) return { cells: new Set<string>(), isValid: false };

    const previewCells = new Set<string>();
    const isValid = isValidPlacement(gameState, selectedBlock, hoverPosition).isValid;

    selectedBlock.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = hoverPosition.y + y;
          const boardX = hoverPosition.x + x;
          if (boardY >= 0 && boardY < BOARD_SIZE && boardX >= 0 && boardX < BOARD_SIZE) {
            previewCells.add(`${boardX}-${boardY}`);
          }
        }
      });
    });

    return { cells: previewCells, isValid };
  };

  const handleMouseEnter = (position: Point) => {
    setHoverPosition(position);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  const preview = selectedBlock && hoverPosition ? getPreviewCells() : null;

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
          const position = { x, y };
          const key = `${x}-${y}`;
          const isPreview = preview?.cells.has(key);

          let backgroundColor = color || '#fff';
          if (isPreview && selectedBlock) {
            backgroundColor = preview.isValid ? `${selectedBlock.color}80` : '#ff000040';
          }

          return (
            <div
              key={key}
              style={{
                width: '25px',
                height: '25px',
                backgroundColor,
                border: '1px solid #ddd',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => onCellClick(position)}
              onMouseEnter={() => handleMouseEnter(position)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })
      )}
    </div>
  );
};

export default Board; 