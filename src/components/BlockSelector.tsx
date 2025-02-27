import React from 'react';
import { Block } from '../types/game';

interface BlockSelectorProps {
  blocks: Block[];
  selectedBlock: Block | null;
  onBlockSelect: (block: Block) => void;
  onRotateBlock?: () => void;
  isMobile: boolean;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({
  blocks,
  selectedBlock,
  onBlockSelect,
  onRotateBlock,
  isMobile
}) => {
  const cellSize = isMobile ? 24 : 20;
  const buttonSize = isMobile ? 30 : 24;

  const renderBlock = (block: Block) => {
    const isSelected = selectedBlock && 
      JSON.stringify(block.shape) === JSON.stringify(selectedBlock.shape) &&
      block.color === selectedBlock.color;

    // 如果這個方塊被選中，使用選中的方塊形狀（可能已經旋轉）
    const displayShape = isSelected ? selectedBlock.shape : block.shape;

    const maxDimension = Math.max(
      displayShape.length,
      Math.max(...displayShape.map(row => row.length))
    );
    
    return (
      <div
        key={JSON.stringify(block.shape)}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${maxDimension}, ${cellSize}px)`,
          gap: '1px',
          margin: isMobile ? '8px' : '5px',
          padding: isMobile ? '8px' : '5px',
          border: isSelected ? `3px solid #000` : '2px solid transparent',
          cursor: 'pointer',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          touchAction: 'manipulation'
        }}
        onClick={() => onBlockSelect(block)}
      >
        {displayShape.map((row, y) => (
          <React.Fragment key={y}>
            {Array(maxDimension).fill(false).map((_, x) => (
              <div
                key={x}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: row[x] ? block.color : 'transparent',
                  border: row[x] ? '1px solid #ddd' : 'none'
                }}
              />
            ))}
          </React.Fragment>
        ))}
        {isSelected && onRotateBlock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRotateBlock();
            }}
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: `${buttonSize/2}px`,
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '18px' : '16px',
              padding: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            title="旋轉方塊"
          >
            ↻
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '12px' : '10px',
      padding: isMobile ? '12px' : '10px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      justifyContent: 'center'
    }}>
      {blocks.map(block => renderBlock(block))}
    </div>
  );
};

export default BlockSelector; 