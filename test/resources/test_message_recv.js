'use strict'

var util = require('util'),
  net = require('net'),
  EventEmitter = require('events').EventEmitter

module.exports = FakeServer
util.inherits(FakeServer, EventEmitter)

function FakeServer ()
{
  EventEmitter.call(this)
  this._server = null
  this._socket = null
}

FakeServer.prototype._listen = function (port, callback)
{
  this._server = net.createServer(this._receivedMessage.bind(this))
  this._server.listen(port, callback)
}

FakeServer.prototype._receivedMessage = function (socket)
{
  this._socket = socket
  this._socket.on('data', this._handle.bind(this))
}

FakeServer.prototype._handle = function (data)
{
  console.log('Data: ' + data)
}

var FakeServer = new FakeServer()
FakeServer._listen(9000, function () { console.log ('FakeServer listening') })