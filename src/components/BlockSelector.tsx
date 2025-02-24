import React from 'react';
import { Block } from '../types/game';

interface BlockSelectorProps {
  blocks: Block[];
  selectedBlock: Block | null;
  onBlockSelect: (block: Block) => void;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({
  blocks,
  selectedBlock,
  onBlockSelect,
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