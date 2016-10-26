/*jslint node: true */
/*jshint asi: true */
'use strict';

var net = require('net'),
  util = require('util'),
  _ = require('underscore'),
  Protocol = require('./Protocol.js'),
  Constants = require('./constants/Constants.js'),
  memwatch = require('memwatch'),
  EventEmitter = require('events').EventEmitter


var _defaults = { debug: false }


module.exports = Server
util.inherits(Server, EventEmitter)

/**
 * Server  
 * 
 * @param {Object} Server setup options
 * @api public
 */
function Server (options)
{
  this._options = _.extend(_defaults, options)

  EventEmitter.call(this)
  this._server = null
  this._connections = []
}


/**
 * Listen server
 * 
 * @param {Number} Port where server listen to 
 * @param {Function} Callback executed after listen 
 * @api public
 */
Server.prototype.listen = function(port, callback)
{
  if (this._options.debug) console.log('Server listening on port: ' + port)

  this._server = net.createServer(this._handleConnection.bind(this))

  this._server.on('error', this._handleServerError.bind(this))
  this._server.on('close', this._handleServerClose.bind(this))

  this._server.listen(port, callback)

}

/**
 * Destroy server
 *
 * @api public
 */
Server.prototype.destroy = function()
{
  this._connections.forEach(function(connection)
  {
    connection.destroy()
  })
  console.log('Server destroyed at: ' + new Date().getTime())
  this._server.close();
}

/**
 * Handle connection
 * 
 * @param {Object} Socket connection
 */
Server.prototype._handleConnection = function(socket)
{
  if (this._options.debug) console.log('Handling connection from: ' + socket.remoteAddress + ' at ' + new Date())

  var connection = new Connection(socket)
  this.emit('connection', connection)
}

/**
 * Handle server 'error' event
 * 
 * @param {Object} Error 
 */
Server.prototype._handleServerError = function (error)
{
  if (this._options.debug) console.log('_handleServerError')
  if (error) throw error
}

/**
 * Handle server 'close' event
 *
 */
Server.prototype._handleServerClose = function ()
{
  if (this._option.debug) console.log('_handleServerClose')
  this._connections = null;
}


util.inherits(Connection, EventEmitter)
function Connection(socket, options)
{
  this._options = _.extend(_defaults, options)
  this._protocol  = new Protocol({config: this._options, connection: socket})

  EventEmitter.call(this)

  // initialization of connection state
  this.state = Constants.CONNECTION_STATE.CONNECTED;

  this._socket = socket
  this._socket.setEncoding('ascii')
  this._socket.setTimeout(Constants.SOCKET_IDLE_TIMEOUT)

  // Node v0.10+ Switch socket into "old mode" (Streams2)
  //this._socket.on('data', this._handleConnectionData.bind(this))

  // Pipe readable streams
  this._socket.pipe(this._protocol)
  this._protocol.pipe(this._socket)

  // Handle socket events: error, end, timeout
  this._socket.on('error', this._handleConnectionError.bind(this))
  this._socket.on('end', this._handleConnectionEnd.bind(this))
  this._socket.on('timeout', this._handleConnectionTimeout.bind(this))
  

  // Handle custom protocol events
  this._protocol.on('handshake', this._handleAuthenticationHandshake.bind(this))

  this._protocol.authenticationHandshake()
}

Connection.prototype._handleConnectionData = function(data)
{
  if (this._options.debug) console.log('Glacier message incoming: ' + data)
}

Connection.prototype._handleConnectionError = function(error)
{
  if (this._options.debug) console.log('_handleConnectionError')
  this._socket.destroy()
}

Connection.prototype._handleAuthenticationHandshake = function()
{
  if (this._options.debug) console.log('_handleAuthenticationHandshake')
  this.state = Constants.CONNECTION_STATE.AUTHENTICATED
}

Connection.prototype._handleConnectionEnd = function ()
{
  if (this._options.debug) console.log('_handleConnectionEnd')
  this._state = Constants.CONNECTION_STATE.DISCONNECT
  this._socket.end()

  // Avoid leaks ?
  this._protocol.destroy()
  this._socket = null
  this._protocol = null
}

Connection.prototype._handleConnectionTimeout = function ()
{
  if (this._options.debug) console.log('_handleConnectionTimeout at ' + new Date())
  this._state = Constants.CONNECTION_STATE.TIMEOUT

  this._protocol.end()
}

memwatch.on('leak', function(info)
{
  console.log('Leak detected -> ' + JSON.stringify(info))
})

var Server = new Server({debug: false})
Server.listen(Constants.SERVER_PORT_LISTEN)