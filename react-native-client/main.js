import Exponent from 'exponent';
import React, { Component } from 'react';
import { Entypo } from '@exponent/vector-icons';
import io from 'socket.io-client/socket.io';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

const socket = io('https://light-art.herokuapp.com', {});

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
        <Text>--- Press the button ---</Text>
        <MyButton />
        <Footer />
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

function Footer() {
  return (
      <Text>Made with <Entypo name="heart-outlined" size={20} color="turquoise" /> by Stephanie </Text>
  );
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
