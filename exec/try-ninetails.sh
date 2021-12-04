#!/bin/bash
# ninetails, network runtime script
# what does it do?
# it downloads the app to a random dir in /tmp (deleted on reboot)
# and simply runs it! try it out!
RAND=$RANDOM
git clone https://github.com/MystPi/ninetails /tmp/$RAND
cd /tmp/$RAND
npm install
npm start
