from socketIO_client import SocketIO

def connect():
    print('connected to the server')

def updateState(state):
    print("The new state on the RPi", state)


def main():
    socketIO = SocketIO('localhost', 3000)
    # Listen
    socketIO.on('connect', connect)

    # Gets msg from other client!
    socketIO.on('updateState', updateState)

    # Keeps the socket open indefinitely...
    socketIO.wait()

if __name__ == '__main__':
    main()
