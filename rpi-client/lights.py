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

def updateState(*args):
    print("The new state on the RPi", args)

    unicorn.set_layout(unicorn.AUTO)
    unicorn.rotation(0)
    unicorn.brightness(0.5)
    width,height=unicorn.get_shape()

    for y in range(height):
      for x in range(width):
        unicorn.set_pixel(x,y,255,0,255)
        unicorn.show()
        time.sleep(0.05)

    time.sleep(1)
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
