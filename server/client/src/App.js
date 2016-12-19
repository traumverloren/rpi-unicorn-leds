import React, { Component } from 'react'
import Board from './components/Board'
import io from 'socket.io-client'
import Header from './components/Header'
import Footer from './components/Footer'
import './css/App.css'

const socket = io('https://light-art.herokuapp.com', {})

class App extends Component {
  constructor () {
    super()
    this.state = { piConnected: true }
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
      <div className="App">
        <Header />
        <Board sendMessage={this.sendMessage} piConnected={this.state.piConnected} />
        <Footer />
      </div>
    )
  }
}

export default App
