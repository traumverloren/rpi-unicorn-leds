import Exponent from 'exponent';
import React, { Component } from 'react';
import { Entypo, FontAwesome } from '@exponent/vector-icons';
import io from 'socket.io-client/socket.io';
import { Font } from 'exponent';

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
  async componentDidMount() {
    await Font.loadAsync({
      'PressStart2P-Regular': require('./assets/fonts/PressStart2P-Regular.ttf'),
      'VT323-Regular': require('./assets/fonts/VT323-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  constructor () {
    super()

    this.state = { piConnected: true, fontLoaded: false }

    this.fetchPiStatus()

    socket.on('connect', () => {
      socket.emit('authentication', {key: process.env.REACT_APP_SOCKET_KEY})

      socket.on('unauthorized', (err) => {
        console.log("There was an error with the authentication:", err.message)
      })

      socket.on('authenticated', () => {
        console.log('React Web app authenticated!')
      })

      socket.emit("clientConnected")
    })
  }

  fetchPiStatus = () => {
    // if pi is connected, set state to true
    socket.on('piConnected', () => {
      this.setState({ piConnected: true})
    })

    // if pi is disconnected, set state to false
    socket.on('piDisconnected', () => {
      this.setState({ piConnected: false})
    })
  }

  sendMessage = (message, data) => {
    socket.emit(message, data)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header fontLoaded={this.state.fontLoaded} />
        <Square />
        <Footer />
      </View>
    );
  }
}



// function Square({ isSelected, onClick, color }) {
  // var squareStyle;
  //
  // if (isSelected) {
  //   squareStyle = {backgroundColor: 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')', width: '100%', height: '100%'}
  // } else {
  //   squareStyle = {backgroundColor: '#2c3e50', width: '100%', height: '100%'}
  // }

  class Square extends Component {
    _onPressButton() {
      console.log("You tapped the button!");
      socket.emit('stateChanged', "Button Pressed from React Native!");
    }

    render() {
      var squareStyle;

      // if (isSelected) {
      //   squareStyle = {backgroundColor: 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')', width: '100%', height: '100%'}
      // } else {
        squareStyle = {backgroundColor: '#2c3e50', width: '100%', height: '100%'}
      // }
      return (
        <View style={{flex: 3}}>
          <TouchableHighlight onPress={this._onPressButton} style={squareStyle}>
            <View />
          </TouchableHighlight>
        </View>

      );
    }

  }

function Header({ fontLoaded }) {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      {
        fontLoaded ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{ ...Font.style('PressStart2P-Regular'), fontSize: 16, marginTop: 20 }}>
            Make Pixel LED Art
          </Text>
          <Text style={{ ...Font.style('VT323-Regular'), fontSize: 16, marginTop: 10, marginLeft: 30, marginRight: 30, textAlign: 'center' }}><FontAwesome name="magic" size={14} /> Pick colors, click squares, & send a design to my Raspberry Pi!</Text>
        </View>
        ) : null
      }
    </View>
  )
}

function Footer() {
  return (
      <View style={{height: 30}}>
        <Text>Made with <Entypo name="heart-outlined" size={20} color="red" /> by Stephanie </Text>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcdcdc',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});

Exponent.registerRootComponent(App);
