import React, { useState, useEffect } from 'react';
import { GameState, Point, Block } from '../types/game';
import { BOARD_SIZE, isValidPlacement } from '../utils/gameUtils';

interface BoardProps {
  gameState: GameState;
  onCellClick: (position: Point) => void;
  selectedBlock: Block | null;
  isMobile: boolean;
}

interface PreviewResult {
  cells: Set<string>;
  isValid: boolean;
}

const Board: React.FC<BoardProps> = ({ gameState, onCellClick, selectedBlock, isMobile }) => {
  const [hoverPosition, setHoverPosition] = useState<Point | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);

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

  const handleTouchStart = (position: Point) => {
    setHoverPosition(position);
    setTouchStartTime(Date.now());
  };

  const handleTouchEnd = (position: Point) => {
    if (touchStartTime && Date.now() - touchStartTime < 500) {
      onCellClick(position);
    }
    setTouchStartTime(null);
    // 不要立即清除懸停位置，讓用戶可以看到預覽
    setTimeout(() => setHoverPosition(null), 500);
  };

  const handleTouchMove = (e: React.TouchEvent, position: Point) => {
    e.preventDefault(); // 防止滾動
    setHoverPosition(position);
  };

  const preview = selectedBlock && hoverPosition ? getPreviewCells() : null;

  const getCellBackgroundColor = (
    baseColor: string | null,
    isPreview: boolean | undefined,
    preview: PreviewResult | null,
    selectedBlock: Block | null
  ): string => {
    if (!isPreview || !selectedBlock || !preview) return baseColor || '#fff';
    return preview.isValid ? selectedBlock.color : '#808080'; // 有效時顯示玩家顏色，無效時顯示灰色
  };

  // 根據設備調整單元格大小
  const cellSize = isMobile ? 30 : 25;

  return (
    <div className="board" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
      gap: '1px',
      backgroundColor: '#ccc',
      padding: '10px',
      borderRadius: '4px',
      touchAction: 'none' // 防止觸摸設備上的縮放和滾動
    }}>
      {Array(BOARD_SIZE).fill(null).map((_, y) =>
        Array(BOARD_SIZE).fill(null).map((_, x) => {
          const color = gameState.board[y][x];
          const position = { x, y };
          const key = `${x}-${y}`;
          const isPreview = preview?.cells.has(key);
          const backgroundColor = getCellBackgroundColor(color, isPreview, preview, selectedBlock);

          return (
            <div
              key={key}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor,
                border: '1px solid #ddd',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onClick={() => onCellClick(position)}
              onMouseEnter={() => handleMouseEnter(position)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(position)}
              onTouchEnd={() => handleTouchEnd(position)}
              onTouchMove={(e) => handleTouchMove(e, position)}
            />
          );
        })
      )}
    </div>
  );
};

export default Board; 