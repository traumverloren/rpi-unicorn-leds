# for testing, make sure the virtual env is set:
# VIRTUAL_ENV=$HOME/.virtualenv
# source $VIRTUAL_ENV/bin/activate

# To RUN:
# sudo python lights.py

import os
import time
import logging
import math
import random
import motephat as mote

from colorsys import hsv_to_rgb
from socketIO_client import SocketIO

logging.getLogger('socketIO-client').setLevel(logging.DEBUG)

socketIO = SocketIO('https://light-art.herokuapp.com')

def connect():
    print('piZero connected to the server')
    # socketIO.emit('authentication', {'key': os.environ['SOCKET_KEY']})
    # socketIO.on('authenticated', authenticated)
    socketIO.emit('piZero Connected')

def reconnect():
    print('reconnected to the server')
    socketIO.emit('piZero Connected')

def on_disconnect():
    print('disconnected')
    socketIO.emit('piZeroDisconnected')

def authenticated(*args):
    print('piZero is connected to the Server')

def updateState(data):
    t_end = time.time() + 10
    squares = data['squares']
    count = 0

    mote.configure_channel(1, 16, False)
    mote.configure_channel(2, 16, False)
    mote.configure_channel(3, 16, False)
    mote.configure_channel(4, 16, False)
    mote.set_brightness(0.1)

    for square in squares:
        if square['isSelected']:
            count += 1
    print(count)

    while time.time() < t_end:

        # easter egg! if all 64 are lit, then rainbow party!
        if count == 64:
            h = time.time() * 50
            for channel in range(4):
                for pixel in range(16):
                    hue = (h + (channel * 64) + (pixel * 4)) % 360
                    r, g, b = [int(c * 255) for c in hsv_to_rgb(hue/360.0, 1.0, 1.0)]
                    mote.set_pixel(channel + 1, pixel, r, g, b)
            mote.show()
            time.sleep(0.01)
        else:
            # lights go from left to right
            for pixel in reversed(range(16)):
                mote.clear()
                mote.set_pixel(1, pixel, random.randint(0,255), random.randint(0,255), random.randint(0,255))
                mote.set_pixel(2, pixel, random.randint(0,255), random.randint(0,255), random.randint(0,255))
                mote.set_pixel(3, pixel, random.randint(0,255), random.randint(0,255), random.randint(0,255))
                mote.set_pixel(4, pixel, random.randint(0,255), random.randint(0,255), random.randint(0,255))
                mote.show()
                time.sleep(0.02)
            mote.show()

    mote.clear()
    mote.show()

def main():
    # Listen
    socketIO.on('connect', connect)

    # Gets msg from other client!
    socketIO.on('updateState', updateState)

    socketIO.on('reconnect', reconnect);

    socketIO.on('disconnect', on_disconnect);

    # Keeps the socket open indefinitely...
    socketIO.wait();

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print 'Killed by user'
        mote.clear()
        mote.show()
        sys.exit(0)
