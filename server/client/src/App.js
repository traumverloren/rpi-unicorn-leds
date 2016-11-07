import React, { Component } from 'react'
import './App.css'
import Checkbox from './components/Checkbox'
import Board from './components/Board'

const io = require('socket.io-client/socket.io');
const socket = io('https://peaceful-oasis-97526.herokuapp.com', {});

socket.on('connect', () => {
  console.log('React Web app is connected to the Server!');
});

socket.on('updateState', function (data) {
    console.log(data);
  });

class App extends Component {
  render() {
    return (
      <div className="App">
        <h3>Light All The Lights:</h3>
        <Checkbox />
        <br />
        <h3>Select Your Lights:</h3>

        <Board />
      </div>
    );
  }
}

export default App;
