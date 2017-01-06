#!/usr/bin/env python

from time import sleep
import colorsys
import math
import time
import unicornhat as unicorn
import numpy

unicorn.set_layout(unicorn.AUTO)
unicorn.rotation(180)
width,height=unicorn.get_shape()

# Height must be exactly 8 lines
# but you can have as wide as you want.
HEART = [
     "             "
    ,"   XX XX     "
    ,"  XXXXXXX    "
    ,"  XXXXXXX    "
    ,"   XXXXX     "
    ,"    XXX      "
    ,"     X       "
    ,"             "
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
    unicorn.brightness(0.4)
    global i
    i = 0 if i>=100*len(ASCIIPIC[0]) else i+1 # avoid overflow

    for w in range(width):
        for h in range(height):
            j = 0.0
            r = (math.cos((h+j)/2.0) + math.cos((w+j)/2.0)) * 64.0 + 128.0
            g = (math.sin((h+j)/1.5) + math.sin((w+j)/2.0)) * 64.0 + 128.0
            b = (math.sin((h+j)/2.0) + math.cos((w+j)/1.5)) * 64.0 + 128.0
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

def poop_rainbows():
    unicorn.brightness(0.3)

    i = 0.0
    offset = 30
    t_end = time.time() + 10

    while time.time() < t_end:
        i = i + 0.3
        for y in range(height):
                for x in range(width):
                        r = 0#x * 32
                        g = 0#y * 32
                        xy = x + y / 4
                        r = (math.cos((x+i)/2.0) + math.cos((y+i)/2.0)) * 64.0 + 128.0
                        g = (math.sin((x+i)/1.5) + math.sin((y+i)/2.0)) * 64.0 + 128.0
                        b = (math.sin((x+i)/2.0) + math.cos((y+i)/1.5)) * 64.0 + 128.0
                        r = max(0, min(255, r + offset))
                        g = max(0, min(255, g + offset))
                        b = max(0, min(255, b + offset))
                        unicorn.set_pixel(x,y,int(r),int(g),int(b))
        unicorn.show()
        time.sleep(0.01)

while True:
    for pattern in patterns:
        rotate_pattern(pattern)
        unicorn.off()
        sleep(3)
        poop_rainbows()
        unicorn.off()
        sleep(3)
