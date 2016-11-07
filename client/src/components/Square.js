import React, { Component } from 'react';

class Square extends Component {
  constructor() {
    super();
    this.state = {isSelected: false};
  }

  componentDidUpdate() {
    console.log('stateChanged', { message: "Button Pressed from React Web!", isSelected: this.state.isSelected, id: this.props.id });
  }

  handleChange(event) {
    event.preventDefault()
    this.setState({
      isSelected: !this.state.isSelected
    });
    event.target.blur();
  }

  render() {
    var className = 'square' + (this.state.isSelected ? '-selected' : '');
    return (
      <button className={className}
          onClick={(event) => this.handleChange(event)}
          style={{
            width: '100%',
            height: '100%'
          }} />
    );
  }
}

export default Square;
