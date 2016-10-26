'use strict'

var fs = require('fs'),
    readline = require('readline'),
    parser = require('../../parser.js')

var rd = readline.createInterface({
    input: fs.createReadStream('./identifiers'),
    output: process.stdout,
    terminal: false
})

rd.on('line', function(line) {
  parser.decodeMessage(line, true)
})
  