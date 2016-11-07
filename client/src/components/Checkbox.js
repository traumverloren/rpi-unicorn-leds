import React, { Component } from 'react';

const io = require('socket.io-client/socket.io');
const socket = io('https://peaceful-oasis-97526.herokuapp.com', {});

class Checkbox extends Component {
  constructor() {
    super();
    this.state = {checked: false};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({checked: event.target.checked});
    // console.log(this.state.checked);
    socket.emit('stateChanged', { message: "Button Pressed from React Web!", checked: event.target.checked });
  }

  render() {
    return (
      <div>
        <input type="checkbox"
          checked={this.state.checked}
          onChange={this.handleChange} />
      </div>
    );
  }
}

export default Checkbox;
