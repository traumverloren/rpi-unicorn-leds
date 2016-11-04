import Exponent from 'exponent';
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

// Need to require instead of import so we can set the user agent first
// This must be below your `window.navigator` hack above
const io = require('socket.io-client/socket.io');
const socket = io('http://localhost:3000', {});

socket.on('connect', () => {
  console.log('React Native is connected to the Server!');
});

socket.on('updateState', function (data) {
    console.log(data);
  });

class App extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Press my button:</Text>
        <MyButton />
      </View>
    );
  }
}

class MyButton extends Component {
  _onPressButton() {
    console.log("You tapped the button!");
    socket.emit('stateChanged', "Button Pressed from React Native!");
  }

  render() {
    return (
      <TouchableHighlight onPress={this._onPressButton}>
        <Text style={{color: 'red', fontWeight: 'bold'}}>Press</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Exponent.registerRootComponent(App);
