import React, { Component } from 'react';
import Square from './Square';

const io = require('socket.io-client/socket.io');
const socket = io('http://localhost:3000', {});

socket.on('connect', function(){
  socket.emit('authentication', {key: process.env.REACT_APP_SOCKET_KEY});

  socket.on('unauthorized', function(err){
    console.log("There was an error with the authentication:", err.message);
  });

  socket.on('authenticated', function() {
    console.log('React Web app is connected to the Server!');
  });

  socket.on('updateState', function (data) {
      console.log(data);
    });
});

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

    return { squares, isSubmitted: false }
  }

  clearBoard(event) {
    this.setState(this.getBoard());
    event.target.blur();
  }

  submitBoard(event) {
    this.setState({isSubmitted: true});
    event.target.blur();
    socket.emit('stateChanged', { message: "Light Design Submitted", squares: this.state.squares });
    // console.log(JSON.stringify(this.state));
  }

  handleClick(id) {
    const squares = this.state.squares.slice();
    squares[id].isSelected = !squares[id].isSelected;
    this.setState({squares: squares});
  }

  render() {
    var successButton = 'btn btn-success' + (this.state.isSubmitted ? ' disabled' : '');

    if (this.state.isSubmitted) {
      var alert = <div className="alert alert-success" role="alert">Light Design Submitted to the Raspberry Pi! Thanks!</div>;
    }

    return (
      // keep board a nice square shape even on mobile!
      <div>
        {alert}
        <h3>Design A Light Pattern:</h3>
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
          <button className={successButton} style={{margin: '5px'}} onClick={(event) => this.submitBoard(event)}>Submit</button>
          <button className="btn btn-danger" style={{margin: '5px'}} onClick={(event) => this.clearBoard(event)}>Clear</button>
        </div>
      </div>

    );
  }
}

export default Board;
