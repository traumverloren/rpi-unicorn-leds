import React, { PropTypes } from 'react';

function Square({ isSelected, onClick }) {
  var className = 'square' + (isSelected ? '-selected' : '');
  return (
    <div className={className}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%'
        }}>
      </div>
  );
}

Square.PropTypes = {
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Square;
