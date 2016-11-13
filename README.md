# [Raspberry Pi Interactive LED Art project](https://light-art.herokuapp.com)

![rainbow lights](sparkleline.gif)

This is my final project for [Harvard's CS50 Course](https://www.edx.org/course/introduction-computer-science-harvardx-cs50x) and first attempt at raspberry pi interactive art. The goal is to interact remotely with the raspberry pi and be able to create pixel art pattern to display on the UnicornHAT.

I am using a lot of new, unfamiliar stuff for this project! e.g. Python, SocketIO, React-Native. 😏 But having a lot of fun learning and figuring out how to build this project!

![rainbow lights](sparkleline.gif)

### My Setup:

##### Schema:

![raspberry pi socketio client server schema diagram](rasppiprojectschema.png)

##### Server: Express

The Server is deployed to Heroku. It sits between the RPi and react web & native apps.

Using SocketIO, it is pushes state changes from the native and web apps to the RPi. The goal from the beginning was to make this accessible remotely, from anyone and anywhere in the world, not just on my local network.

##### **Clients:**
- **Raspberry Pi 3 w/ UnicornHAT 64-led board.**

  The RPi is coded in Python, since the UnicornHAT library is in Python. I created a python program that serves as a client with the socketio server, using a [python socketio client library](https://github.com/invisibleroads/socketIO-client), and listens for incoming messages from the other clients. It then interprets the messages and creates the LED light pattern using the [UnicornHAT library](https://github.com/pimoroni/unicorn-hat/).

- **ReactJS web app.**

  Written in ES6 using React, this client is located on the server. Users on the web can create pixel art designs to display on the Raspberry Pi.

- **React-Native mobile app (Work in Progress)**

  Written in ES6 using React-Native, this client provides a native experience for both iOS and Android. Users can natively create pixel art designs to display on the Raspberry Pi.

![rainbow lights](sparkleline.gif)

Made with 💚💙💜 by [Stephanie](https://traumverloren.github.io)
