# rpi-unicorn-leds

![under construction gif](https://www.heelzwaarleven.nl/underconstruction.gif)

This is my (WIP) final project for Harvard's CS50 Course and first attempt at raspberry pi interactive art. The goal is to interact remotely with the raspberry pi and be able to create pixel art pattern to display on the UnicornHAT.

I am using a lot of new, unfamiliar stuff for this project: Python, SocketIO, React-Native.

---

#### Setup:

Server: Express

Clients:
- Raspberry Pi 3 w/ UnicornHAT 64-led board.
- React-Native mobile app.

The Server sits between the RPi and native apps. Using SocketIO, will be able to push state changes from the native app to the RPi. And the goal from the beginning is to make this accessible remotely, not just on a local network. Should be really cool!

---

Made with <3 by [Stephanie](https://traumverloren.github.io)
