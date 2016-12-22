#!/usr/bin/env python

from time import sleep
import colorsys
import math
import time
import unicornhat as unicorn


print("""ASCII Pic
You should see a scrolling image, defined in the below variable ASCIIPIC.
If the smiley looks sad, change the rotation from 0 to 180.
""")

unicorn.set_layout(unicorn.AUTO)
unicorn.rotation(180)
unicorn.brightness(0.3)
width,height=unicorn.get_shape()

# Every line needs to be exactly 8 characters
# but you can have as many lines as you like.
HEART = [
     " XX XX  "
    ,"XXXXXXX "
    ,"XXXXXXX "
    ," XXXXX  "
    ,"  XXX   "
    ,"   X    "
    ,"        "
    ,"        "
    ,"        "
    ]

SMILEY = [
     "  X  X  "
    ,"        "
    ,"X      X"
    ," X    X "
    ,"  XXXX  "
    ,"        "
    ,"        "
    ,"        "
    ,"        "
    ]

YO = [
     "  X   X "
    ,"  X   X "
    ,"   XXX  "
    ,"    X   "
    ,"    X   "
    ,"        "
    ,"   XXX  "
    ,"  X   X "
    ,"  X   X "
    ,"   XXX  "
    ,"        "
    ,"        "
    ,"        "
    ,"        "
    ,"        "
    ]

patterns = [HEART,SMILEY, YO]

i = -1
offset = 30

def step(ASCIIPIC):
    global i
    i = 0 if i>=100*len(ASCIIPIC) else i+1 # avoid overflow
    for h in range(height):
        for w in range(width):
            j = 0.0
            r = 0#x * 32
            g = 0#y * 32
            hw = h + w / 4
            r = (math.cos((h+j)/2.0) + math.cos((w+j)/2.0)) * 64.0 + 128.0
            g = (math.sin((h+j)/1.5) + math.sin((w+j)/2.0)) * 64.0 + 128.0
            b = (math.sin((h+j)/2.0) + math.cos((w+j)/1.5)) * 64.0 + 128.0
            r = max(0, min(255, r + offset))
            g = max(0, min(255, g + offset))
            b = max(0, min(255, b + offset))

            hPos = (i+h) % len(ASCIIPIC)
            chr = ASCIIPIC[hPos][w]
            if chr == ' ':
                unicorn.set_pixel(w, h, 0, 0, 0)
            else:
                unicorn.set_pixel(w, h, int(r),int(g),int(b))
    unicorn.show()

def rotate_pattern(pattern):
    for _ in " "*30:
        step(pattern)
        sleep(0.3)

while True:
    for pattern in patterns:
        rotate_pattern(pattern)
        unicorn.off()
        sleep(1)
