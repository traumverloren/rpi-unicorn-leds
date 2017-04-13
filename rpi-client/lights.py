# for testing, make sure the virtual env is set:
# VIRTUAL_ENV=$HOME/.virtualenv
# source $VIRTUAL_ENV/bin/activate

# To RUN:
# sudo python lights.py

import os
import time
import logging
import unicornhat as unicorn
from collections import Counter

from socketIO_client import SocketIO

logging.getLogger('socketIO-client').setLevel(logging.DEBUG)

socketIO = SocketIO('https://light-art.herokuapp.com')

def connect():
    print('connected to the server')
    socketIO.emit('authentication', {'key': os.environ['SOCKET_KEY']})
    socketIO.on('authenticated', authenticated)
    socketIO.emit('piConnected')

def reconnect():
    print('reconnected to the server')
    socketIO.emit('piConnected')

def on_disconnect():
    print('disconnected')
    socketIO.emit('piDisconnected')

def authenticated(*args):
    print('RPI is connected to the Server')

def rgb_to_hex(red, green, blue):
    return '%02x%02x%02x' % (red, green, blue)

def send_colors_to_shirt(squares):
    # filter only squares that are selected
    selected_squares = list(filter(lambda square: square['isSelected'], squares))

    # just return the color object
    squares_rgb = list(map(lambda x: x['color'], selected_squares))

    # convert rgb to hex colors
    squares_hex = list(map(lambda x: rgb_to_hex(x['r'], x['g'], x['b']), squares_rgb))

    # reduce and count colors
    counted_colors = Counter(squares_hex)

    # return sorted colors as list (array)
    sorted_colors = list(counted_colors.keys())

    shirt_message = ""

    if (len(sorted_colors) == 1):
        shirt_message = "%s %s" % (sorted_colors[0], sorted_colors[0])
    else:
        shirt_message = "%s %s" % (sorted_colors[0], sorted_colors[1])

    print(shirt_message)
    socketIO.emit('alertShirt', shirt_message)

def updateState(data):
    squares = data['squares']

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

    send_colors_to_shirt(squares)

    unicorn.show()
    time.sleep(7)

    unicorn.off()

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
        sys.exit(0)
