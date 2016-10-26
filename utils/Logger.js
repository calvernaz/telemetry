]/*jslint node: true */
/*jshint asi: true */
'use strict';

var dateFormat = require('dateformat')

module.exports = Logger

var _defaults = {
  level: 'DEBUG'
}

function Logger (options) {
  this.options = options || _defaults
  this.level = this.options.level

  this.buffer = { message: '', from: '', object: '' }
}

Logger.prototype.log = function (logMessage) {
  this.buffer.write(logMessage)

  if (this.level == 'INFO')
    this.info(logMessage)
  else if (this.level == 'DEBUG')
    this.debug(logMessage)
  else
    this.trace(logMessage)
}

Logger.prototype.info = function () {
  console.log('INFO ' + this.buffer.message)
}

Logger.prototype.debug = function () {

  console.log('DEBUG ' + this.buffer.message + ' ' + this.buffer.object)
}

Logger.prototype.trace = function () {
  console.log('TRACE [' + dateFormat() + '] ' + this.buffer.from + ' ' + 
    this.buffer.message + ' ' + this.buffer.object)
}