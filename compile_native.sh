#!/bin/sh

rm -rf node_modules/soap/node_modules
cd ./node_modules/soap
npm install -d
cd ../../
npm install memwatch