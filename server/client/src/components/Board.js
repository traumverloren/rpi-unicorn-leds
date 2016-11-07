import React, { Component } from 'react';
import Square from './Square';

class Board extends Component {
  constructor() {
  super();
  this.state = {
    squares: Array(64).fill(null),
  };
}
  renderSquare(i) {
    return (
      <div key={i}
           style={{flex: '0 0 12.5%', height: '12.5%'}}>
        <Square id={i}/>
      </div>
    );
  }

  render() {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      // keep board a nice square shape even on mobile!
      <div style={{
        listStyle: 'none',
        height: '40vmax', // change unit based on orientation
        width: '40vmax', // change unit based on orientation
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        margin: 'auto',
        padding: '0px'
      }}>
        {squares}
      </div>
    );
  }
}


export default Board;
