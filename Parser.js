/*jslint node: true */
/*jshint asi: true */
'use strict';

var Constants = require('./constants/Constants.js')
module.exports = Parser

/**
* This class is responsible for parsing data from socket
*
* @class Parser
* @param {Object} config
* @constructor
*/
function Parser(config)
{
  this._internalBuffer = ''
  this._messageProcessed = ''

  this._config = config || {}
  this._debug = this._config.debug || false

  this._onMessage = this._config.onMessage || function () {}
}


/**
 * Write the message to the internal buffer,
 * parse delimiters and call method onMessage.
 *
 * @return an {String} without delimiters
 * @api public
 */
Parser.prototype.write = function(buffer)
{
 // Append to internal buffer
  this.append(buffer)
  
  while (this.parseDelimiters()) {
    this._onMessage()
  }
}

/**
 Parse a message and take-off delimiters.
 To get the process message, use method `getProcessedMessage`
 
 @method parseDelimiters
 @return an {String} without delimiters, used just for loop control, 
 don't use the returned message.
 */
Parser.prototype.parseDelimiters = function ()
{
  var startMark,
  terminationMark,
  extractedMessage

  // Start message mark
  startMark = this._internalBuffer.indexOf(Constants.SYNC_MARK)
  if (startMark == -1) return null

  // End message mark
  terminationMark = this._internalBuffer.indexOf(Constants.CRLF)
  if (terminationMark == -1) return null

  extractedMessage = this._internalBuffer.substring(startMark+1, terminationMark)
  
  if (extractedMessage) this.subtract(terminationMark+1)

  this._messageProcessed = extractedMessage

  return extractedMessage
}

/**
 * Append data to internal buffer.
 * 
 * @method append
 * @api public
 */
Parser.prototype.append = function (buffer)
{
  this._internalBuffer += buffer
  if (this._debug) console.log('Internal buffer, after append -> ' + this._internalBuffer)
}

/**
 * Subtract number of chars from internal buffer.
 * 
 * @method subtract
 * @api public
 */
Parser.prototype.subtract = function (nChars)
{
  this._internalBuffer = this._internalBuffer.slice(nChars)
  if (this._debug) console.log('Internal buffer, after substract -> ' + this._internalBuffer)
}


Parser.prototype.getProcessedMessage = function ()
{
  return this._messageProcessed
}