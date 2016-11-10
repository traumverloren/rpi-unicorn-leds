# for testing, make sure the virtual env is set:
# VIRTUAL_ENV=$HOME/.virtualenv
# source $VIRTUAL_ENV/bin/activate

# To RUN:
# python lights.py

import os
import time
import unicornhat as unicorn

from socketIO_client import SocketIO

def connect():
    print('connected to the server')


# def authenticated(*args):
#     print('RPI is connected to the Server')

def updateState(data):
    squares = data['squares']
    print(squares)

    # iterate through array and find the lights, turn them on.
    unicorn.set_layout(unicorn.AUTO)
    unicorn.rotation(180)
    unicorn.brightness(0.3)

    for square in squares:
        if square['isSelected']:
            x = square['coords'][0]
            y = square['coords'][1]
            r = square['color']['r']
            g = square['color']['g']
            b = square['color']['b']

            unicorn.set_pixel(x,y,r,g,b)

    unicorn.show()
    time.sleep(10)

    unicorn.off()

def main():
    socketIO = SocketIO('https://peaceful-oasis-97526.herokuapp.com')

    # Listen
    socketIO.on('connect', connect)

    # socketIO.emit('authentication', {'key': os.environ['SOCKET_KEY']})
    # socketIO.on('authenticated', authenticated)

    # Gets msg from other client!
    socketIO.on('updateState', updateState)

    # Keeps the socket open indefinitely...
    socketIO.wait()

if __name__ == '__main__':
    main()
