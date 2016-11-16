import Exponent from 'exponent';
import React, { Component } from 'react';
import { Entypo, FontAwesome } from '@exponent/vector-icons';
import io from 'socket.io-client/socket.io';
import { Font } from 'exponent';
import DropdownAlert from 'react-native-dropdownalert';

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
      this.showAlert('error');
    })
  }

  showAlert = (type) => {
    switch (type) {
      case 'error':
        this.dropdown.alertWithType(type, 'oh nooos!  (╯°□°）╯︵ ┻━┻ ', 'The raspberry pi is currently offline. Try again later.')
      break;
      case 'custom':
        this.dropdown.alertWithType(type, 'yay!  \\ (•◡•) /', 'Light Design Submitted to the Raspberry Pi! Thanks for creating art!')
      break;
    }
  }

  closeAlert = () => {
    this.dropdown.onClose()
  }
  onClose(data) {
    console.log(data)
  }

  sendMessage = (message, data) => {
    socket.emit(message, data)
  }


  render() {
    return (
      <View style={styles.container}>
        <Header fontLoaded={this.state.fontLoaded} />
        <Board
          sendMessage={this.sendMessage}
          showAlert={this.showAlert}
          piConnected={this.state.piConnected}
          fontLoaded={this.state.fontLoaded} />
        <Footer fontLoaded={this.state.fontLoaded} />
        <DropdownAlert ref={(ref) => this.dropdown = ref}
          closeInterval={5000}
          onCancel={(data) => this.onClose(data)}
          containerStyle={{
            backgroundColor: 'limegreen',
          }}
          titleStyle={{
            marginTop: 20,
            fontSize: 16,
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'transparent',
          }}
          showCancel={true}/>
      </View>
    );
  }
}

class Board extends Component {
  constructor(props) {
    super()
    this.state = this.getBoard()
  }

  getBoard = () => {
    const squares = []

    // i is the square number 0 - 63.
    var i = 0

    // Loop through to generate the x,y coords.
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        squares.push({
            id: i,
            coords: [x,y],
            isSelected: false,
            color: {r: 44, g: 62, b: 80}
        })
        i++
      }
    }

    // set initial state with 64-array of squares
    return { squares, isSubmitted: false, color: {r: 255, g: 235, b: 59} }
  }

  clearBoard = () => {
    this.setState(this.getBoard())
  }

  submitBoard = () => {
    this.setState({isSubmitted: true})
    this.props.sendMessage('stateChanged', {message: "Light Design Submitted", squares: this.state.squares } )
    this.props.showAlert('custom')
  }

  handlePress = (id) => {
    const squares = this.state.squares.slice()
    squares[id].isSelected = !squares[id].isSelected
    squares[id].color = this.state.color
    this.setState({squares: squares})
  }

  render () {
    return (
      <View style={styles.board}>
        <View style={styles.squares}>
          {this.state.squares.map((square) => (
            <View key={square.id} style={styles.square}>
              <Square
                id={square.id}
                isSelected={square.isSelected}
                coords={square.coords}
                color={square.color}
                onPress={() => this.handlePress(square.id)} />
            </View>
          ))}
        </View>
        <Buttons
          isSubmitted={this.state.isSubmitted}
          piConnected={this.props.piConnected}
          fontLoaded={this.props.fontLoaded}
          submitBoard={() => this.submitBoard()}
          clearBoard={() => this.clearBoard()} />
      </View>
    )
  }
}

function Buttons({ isSubmitted, piConnected, fontLoaded, submitBoard, clearBoard }) {
  if (isSubmitted) {
    var submitButtonStyling = styles.submitButtonDisabled
    var resetButtonStyling = styles.resetButton
  } else if (!piConnected) {
    var submitButtonStyling = styles.submitButtonDisabled
    var resetButtonStyling = styles.resetButtonDisabled
  } else {
    var submitButtonStyling = styles.submitButton
    var resetButtonStyling = styles.resetButton
  }

  return (
    <View style={styles.buttons}>
      <TouchableHighlight
        disabled={isSubmitted || !piConnected}
        underlayColor='#32CD32'
        style={submitButtonStyling}
        onPress={submitBoard}>
          <View>
            {
              fontLoaded ? (
                <Text style={{ ...Font.style('VT323-Regular'), fontSize: 18}} >Submit</Text>
              ) : null
            }
          </View>
      </TouchableHighlight>

      <TouchableHighlight
        underlayColor='#b22222'
        disabled={!piConnected}
        style={resetButtonStyling}
        onPress={clearBoard}>
        <View>
          {
            fontLoaded ? (
              <Text style={{ ...Font.style('VT323-Regular'), fontSize: 18}} >Clear</Text>
            ) : null
          }
        </View>
      </TouchableHighlight>
    </View>
  )
}

function Square({ isSelected, onPress, color }) {
  var squareStyle;

  if (isSelected) {
    squareStyle = {backgroundColor: 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')', width: 38, height: 38}
  } else {
    squareStyle = {backgroundColor: '#2c3e50', width: 38, height: 38}
  }
  if (isSelected) {
    squareStyle = {backgroundColor: 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')', width: 38, height: 38}
  } else {
    squareStyle = {backgroundColor: '#2c3e50', width: 38, height: 38}
  }
  return (
    <View>
      <TouchableHighlight onPress={onPress} style={squareStyle}>
        <View />
      </TouchableHighlight>
    </View>
  );
}

function Header({ fontLoaded }) {
  return (
    <View style={styles.header}>
      {
        fontLoaded ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{ ...Font.style('PressStart2P-Regular'), fontSize: 16, marginTop: 20 }}>
            Make Pixel LED Art
          </Text>
          <Text style={{ ...Font.style('VT323-Regular'), fontSize: 18, marginTop: 10, marginBottom: 4, textAlign: 'center', color: 'blue' }}><FontAwesome name="magic" size={14} /> Pick colors.</Text>
          <Text style={{ ...Font.style('VT323-Regular'), fontSize: 18, marginBottom: 4, textAlign: 'center', color: 'teal' }}><FontAwesome name="hand-pointer-o" size={14} /> Click squares.</Text>
          <Text style={{ ...Font.style('VT323-Regular'), fontSize: 18, marginBottom: 4, textAlign: 'center', color: 'limegreen'}}><FontAwesome name="envelope-o" size={14} /> Send a design to my Raspberry Pi!</Text>
        </View>
        ) : null
      }
    </View>
  )
}

function Footer({ fontLoaded }) {
  return (
      <View style={styles.footer}>
        {
          fontLoaded ? (
            <Text style={{ ...Font.style('VT323-Regular'), fontSize: 18,}} >Made with <Entypo name="heart-outlined" size={20} color="red" /> by Stephanie </Text>
          ) : null
        }
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
  header: {
    flex: .2,
    marginTop: 20,
  },
  footer: {
    flex: .1,
    marginBottom: 2,
  },
  square: {
    width: 38,
    height: 38,
    margin: -1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black'
  },
  board: {
    flex: .7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  squares: {
    flex: .8,
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300
  },
  buttons: {
    flex: .2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#00FF00',
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'limegreen',
    padding: 4,
    margin: 5,
  },
  resetButton: {
    backgroundColor: 'red',
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'firebrick',
    padding: 4,
    margin: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#00FF00',
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'limegreen',
    padding: 4,
    margin: 5,
    opacity: 0.4,
  },
  resetButtonDisabled: {
    backgroundColor: 'red',
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'firebrick',
    padding: 4,
    margin: 5,
    opacity: 0.4
  }
});

Exponent.registerRootComponent(App);
