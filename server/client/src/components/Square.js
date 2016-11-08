import React from 'react';

function Square(props) {
  var className = 'square' + (props.isSelected ? '-selected' : '');
  return (
    <div className={className}
        onClick={() => props.onClick()}
        style={{
          width: '100%',
          height: '100%'
        }}>
      </div>
  );
}

export default Square;
