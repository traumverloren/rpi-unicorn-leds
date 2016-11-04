from socketIO_client import SocketIO

def connect():
    print('connected to the server')

def updateState(*args):
    print("The new state on the RPi", args)


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
