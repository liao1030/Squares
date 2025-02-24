import React from 'react';
import { Block } from '../types/game';
import { rotateBlock } from '../utils/gameUtils';

interface BlockSelectorProps {
  blocks: Block[];
  selectedBlock: Block | null;
  onBlockSelect: (block: Block) => void;
  onRotateBlock?: () => void;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({
  blocks,
  selectedBlock,
  onBlockSelect,
  onRotateBlock
}) => {
  const renderBlock = (block: Block) => {
    const maxDimension = Math.max(
      block.shape.length,
      Math.max(...block.shape.map(row => row.length))
    );
    
    return (
      <div
        key={JSON.stringify(block.shape)}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${maxDimension}, 20px)`,
          gap: '1px',
          margin: '5px',
          padding: '5px',
          border: selectedBlock === block ? '2px solid #000' : '2px solid transparent',
          cursor: 'pointer',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}
        onClick={() => onBlockSelect(block)}
      >
        {block.shape.map((row, y) => (
          <React.Fragment key={y}>
            {Array(maxDimension).fill(false).map((_, x) => (
              <div
                key={x}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: row[x] ? block.color : 'transparent',
                  border: row[x] ? '1px solid #ddd' : 'none'
                }}
              />
            ))}
          </React.Fragment>
        ))}
        {selectedBlock === block && onRotateBlock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRotateBlock();
            }}
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '24px',
              height: '24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              padding: 0
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
      gap: '10px',
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {blocks.map(block => renderBlock(block))}
    </div>
  );
};

export default BlockSelector; 