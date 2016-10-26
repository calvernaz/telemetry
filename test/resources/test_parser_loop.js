'use strict'

var fs = require('fs'),
readline = require('readline')


var CRLF = '\\n',
SYNC_MARK = ':'

var rd = readline.createInterface({
  input: fs.createReadStream('./identifiers_loop'),
  output: process.stdout,
  terminal: false
})

var parser = new Parser()
rd.on('line', function (line) {
  console.log('Incoming msg -> ' + line)
  parser.parseStream(line)
})


function Parser()
{
  this._internalBuffer = ''
}

Parser.prototype.parseStream = function (buffer)
{

  // Append to internal buffer
  this.append(buffer)
  var msg
  while (msg = this.stripMessage()) {
    console.log('Message to execute -> ' + msg)
    this.showInternalBuffer()
  }
}

Parser.prototype.stripMessage = function ()
{
  var startMark,
  terminationMark,
  extractedMessage

  // Start message mark
  startMark = this._internalBuffer.indexOf(SYNC_MARK)
  if (startMark == -1) return null

  // End message mark
  terminationMark = this._internalBuffer.indexOf(CRLF)
  if (terminationMark == -1) return null

  extractedMessage = this._internalBuffer.substring(startMark+1, terminationMark)
  
  if (extractedMessage) this.subtract(terminationMark+2)

  return extractedMessage
}

Parser.prototype.append = function (buffer)
{
  this._internalBuffer += buffer
}

Parser.prototype.subtract = function (nChars)
{
  this._internalBuffer = this._internalBuffer.slice(nChars)
}

Parser.prototype.showInternalBuffer = function ()
{
  var msgLength = this._internalBuffer.length
  if (msgLength > 0)
    console.log('iBuffer -> ' + this._internalBuffer)
}



