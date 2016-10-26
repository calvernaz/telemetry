/*jslint node: true */
/*jshint asi: true */
'use strict';

var readline = require('readline'),
  Util = require('util'),
  fs = require('fs'),
  EventEmitter = require('events').EventEmitter

/**
@module sequences
**/
module.exports = FirmwareReader
Util.inherits(FirmwareReader, EventEmitter)


var _defaultConfig = {
  path: process.env.PWD + '/scripts/firmware/GlacierCTRL.hex',
  debug: false
}

/**
 * @class FirmwareReader
 * @constructor
 */
function FirmwareReader(config)
{
  EventEmitter.call(this)

  this._config = config || _defaultConfig
  this._debug = this._config.debug || false
  this._path = this._config.path || './firmware.hex'
  this.blockSize = this._config.blockSize || 5

  this.rl = readline.createInterface({
    input: fs.createReadStream(this._path),
    output: process.stdout,
    terminal: false
  })

  this.buffer = []
}


FirmwareReader.prototype.readFile = function ()
{  
  var self = this
  this.rl.on('line', function (line)
  {
    var lreplaced = line.replace(":", ":51 ")
    self.buffer.push(lreplaced)
  })

  this.rl.on('close', function ()
  {
    self.emit('eof')
  })
}

FirmwareReader.prototype.hasNextLine = function ()
{
  var l = this.buffer.length  
  return l !== 0 ? true : false
}

FirmwareReader.prototype.nextLine = function ()
{
  var line = this.buffer.shift()
  return line !== 'undefined' ? line : null
}

FirmwareReader.prototype.nextBurst = function ()
{
 var lines = this.buffer.splice(0, this.blockSize).join('\n').concat('\n')
 return lines
}



FirmwareReader.prototype.readFileDryRun = function ()
{  
  var self = this
  this.rl.on('line', function (line)
  {
    self.buffer.push(line)
  })

  this.rl.on('close', function ()
  {
    self.emit('eof')
  })
}

FirmwareReader.prototype.nextBurstDryRun = function ()
{
 var lines = this.buffer.splice(0,20).join('\r\n').concat('\r\n')
 return lines
}

FirmwareReader.prototype.close = function ()
{
  if (!this.buffer.length)
    this.buffer = null

  this.rl.close()
  this.rl = null
}