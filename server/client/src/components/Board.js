import React, { Component } from 'react';
import Square from './Square';

class Board extends Component {
  constructor() {
    super();
    this.state = this.getBoard();
  };

  getBoard() {
    const squares = [];

    for (let i = 0; i < 64; i++) {
        squares.push({
            id: i,
            isSelected: false
        });
    }

    return { squares }
  }

  clearBoard(event) {
    this.setState(this.getBoard());
    event.target.blur();
  }

  handleClick(id) {
    const squares = this.state.squares.slice();
    squares[id].isSelected = !squares[id].isSelected;
    this.setState({squares: squares});
  }

  render() {
    return (
      // keep board a nice square shape even on mobile!
      <div>
        <div style={{
          listStyle: 'none',
          height: '40vmax',
          width: '40vmax',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          margin: 'auto',
          padding: '0px'
        }}>
          {this.state.squares.map((square) => (
            <div key={square.id}
                 style={{flex: '0 0 12.5%', height: '12.5%'}}>
              <Square id={square.id} isSelected={square.isSelected} onClick={() => this.handleClick(square.id)} />
            </div>
          ))}
        </div>
        <div>
          <button className="btn btn-success" style={{margin: '5px'}} >Submit</button>
          <button className="btn btn-danger" style={{margin: '5px'}} onClick={(event) => this.clearBoard(event)}>Clear</button>
        </div>
      </div>

    );
  }
}

export default Board;
