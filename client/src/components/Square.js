import React, { PropTypes } from 'react';
import '../css/Square.css'

function Square({ isSelected, onClick, color }) {
  var squareStyle;

  if (isSelected) {
    squareStyle = {backgroundColor: 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')', width: '100%', height: '100%'}
  } else {
    squareStyle = {backgroundColor: '#2c3e50', width: '100%', height: '100%'}
  }

  return (
    <div className='Square'
        onClick={onClick}
        style={squareStyle}>
      </div>
  );
}

Square.PropTypes = {
  color: React.PropTypes.shape({
      r: React.PropTypes.number.isRequired,
      g: React.PropTypes.number.isRequired,
      b: React.PropTypes.number.isRequired
    }),
  coords: PropTypes.array.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Square
