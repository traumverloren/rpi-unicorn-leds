import React, { Component } from 'react';

const io = require('socket.io-client/socket.io');
const socket = io('https://peaceful-oasis-97526.herokuapp.com', {});

class Checkbox extends Component {
  constructor() {
    super();
    this.state = {checked: false};
  }

  handleChange(event) {
    this.setState({checked: event.target.checked});
    // console.log(this.state.checked);
    socket.emit('stateChanged', { message: "Button Pressed from React Web!", checked: event.target.checked });
  }

  render() {
    return (
      <div class="checkbox">
        <input type="checkbox"
          checked={this.state.checked}
          onChange={(event) => this.handleChange(event)} />
      </div>
    );
  }
}

export default Checkbox;
