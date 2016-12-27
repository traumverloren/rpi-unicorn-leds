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
unicorn.brightness(0.4)
width,height=unicorn.get_shape()

# Every line needs to be exactly 8 characters
# but you can have as many lines as you like.
HEART = [
     "           "
    ," XX XX     "
    ,"XXXXXXX    "
    ,"XXXXXXX    "
    ," XXXXX     "
    ,"  XXX      "
    ,"   X       "
    ,"           "
    ]

LIGHT = [
     "                                                                   "
    ,"   X    X   XXX  X  X XXXXX   X   X X   X   XXX   X  XXX   XXXX    "
    ,"   X    X  X     X  X   X     XX XX X   X   X  X  X  X  X  X       "
    ,"   X    X  X     X  X   X     X X X  X X    X  X  X  X   X XXX     "
    ,"   X    X  X XXX XXXX   X     X   X   X     XXX   X  X   X X       "
    ,"   X    X  X   X X  X   X     X   X   X     X  X  X  X  X  X       "
    ,"   XXXX X   XXX  X  X   X     X   X   X     X   X X  XXX   XXXX    "
    ,"                                                                   "
    ]

SMILEY = [
     "      XXXX      "
    ,"     XXXXXX     "
    ,"    XX XX XX    "
    ,"    XXXXXXXX    "
    ,"    XXXXXXXX    "
    ,"    X XXXX X    "
    ,"     X    X     "
    ,"      XXXX      "
    ]

YO = [
     "                  "
    ,"   X   X  XXX     "
    ,"   X   X X   X    "
    ,"    X X  X   X    "
    ,"     X   X   X    "
    ,"     X   X   X    "
    ,"     X    XXX     "
    ,"                  "
    ]

patterns = [LIGHT,HEART,SMILEY,LIGHT,YO]

offset = 50
i = 0

def step(ASCIIPIC):
    global i
    i = 0 if i>=100*len(ASCIIPIC[0]) else i+1 # avoid overflow

    for w in range(width):
        for h in range(height):
            j = 0.0
            r = (math.cos((h+j)/1.0) + math.sin((w+j)/1.0)) * 64.0 + 128.0
            g = (math.cos((h+j)/2.0) + math.cos((w+j)/2.0)) * 64.0 + 128.0
            b = (math.sin((h+j)/2.0) + math.cos((w+j)/2.0)) * 64.0 + 128.0
            r = max(0, min(255, r + offset))
            g = max(0, min(255, g + offset))
            b = max(0, min(255, b + offset))

            wPos = (i+w) % len(ASCIIPIC[0])
            chr = ASCIIPIC[h][wPos]
            if chr == ' ':
                unicorn.set_pixel(w, h, 0, 0, 0)
            else:
                unicorn.set_pixel(w, h, int(r),int(g),int(b))
    unicorn.show()

def rotate_pattern(pattern):
    for _ in " "*200:
        step(pattern)
        sleep(0.1)

while True:
    for pattern in patterns:
        rotate_pattern(pattern)
        unicorn.off()
        sleep(1)
