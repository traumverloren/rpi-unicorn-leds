import Exponent from 'exponent';
import React from 'react';

import {
  StyleSheet,
  Text,
  View,
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

socket.emit('stateChanged', "Hi from React Native!");

class App extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up main.js to start working on your app!</Text>
      </View>
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
