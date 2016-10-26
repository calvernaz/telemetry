/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  Stream = require('stream'),
  ChildProcess = require('child_process'),
  Parser = require('./Parser'),
  Decoder = require('./Decoder'),
  Persistence = require('./api/persistence'),
  Sequences = require('./sequences'),
  Messages = require('./messages')


module.exports = Protocol
Util.inherits(Protocol, Stream)


/**
 * Protocol  
 * 
 * @param {Object} Server setup options
 * @api public
 */
function Protocol(options)
{
   Stream.call(this)

   // Setup stream 
   this.readable = true;
   this.writable = true;

   this.connection = options.connection
   
   // Queue for messages
   this._queue = []
   // Handshake status
   this._handshaked = false;
   // Protocol parser
   this._parser = new Parser({ onMessage: this._parseMessage.bind(this) })
   // Protocol dissector
   this._decoder = new Decoder({ parser: this._parser })
   // WS API to get commands
   this.WsAPI = new Persistence()

   // Direct-Mode
   this.directMode = false
}

/**
 * Authentication handshake handler
 * 
 * @param {Function} callback to be called when event 
 *        'handshake' is emitted
 * @api public
 */
Protocol.prototype.authenticationHandshake = function(callback)
{
  return this._enqueue(new Sequences.AuthenticationHandshake({}, callback))
}

/**
 * Adds the sequence to the queue to be processed and 
 * start execution.
 * 
 * @param {Object} that extends {Sequence}
 */
Protocol.prototype._enqueue = function(sequence)
{

  this._queue.push(sequence)

  var self = this
  sequence.on('packet', function(message)
  {
    self._emitMessage(message)
  })
  .once('nextsequence', function (nextSequence)
  {
    self._nextSequence(nextSequence)
  })
  .once('directmode', function (info)
  {
    self._nextSequence(info.request)

    var parent_channel = ChildProcess.fork(__dirname + '/child/child-server2.js')
    parent_channel.send({ 'port': info.port }, self.connection)

    parent_channel.on('message', function (msg, con) {
      self.connection = con

      self.connection.write('QUIT\n', function () {
        console.log('QUIT command finally flushed')
        con.on('data', function (r) {
          self.write(r)

          // NEW LINE
          parent_channel.disconnect()
          parent_channel.kill()
        })
      })

      if (!parent_channel.connected)
        parent_channel.kill()

      self.directMode = false

      parent_channel.on('exit', function () {
        console.log('child exit!')
      })

      parent_channel.on('error', function () {
        console.log('child error!')
      })
    })
  })
  .once('end', function()
  {
    self._dequeue()
  })

  if (this._queue.length === 1)
  {
    sequence.start();
  }

  return sequence;
}

/**
 * Removes the sequence to the queue to be processed.
 * 
 * @param {Object} that extends the {Sequence}
 */
Protocol.prototype._dequeue = function()
{
  this.oldSequence = this._queue.shift()

  var sequence = this._queue[0]
  if (!sequence) {
    this.emit('drain')
    return
  }
}


/**
 * When data arrives, this method is called
 * 
 * @param {String} containing the data in the socket
 * @api public
 */
Protocol.prototype.write = function(buffer)
{
  if (!this.directMode) {
    this._parser.write(buffer)
    return true
  }
}

/**
 * Parses the message already queued.
 */
Protocol.prototype._parseMessage = function()
{
  var sequence = this._queue[0]

  var Message = this._determineMessage(sequence)

  if (Message)
    sequence[Message.name](this._decoder.decodeMessage(false, true))
}

/**
 * Determine the message type
 *
 * @param {Object} that extends the {Sequence}
 */
Protocol.prototype._determineMessage = function(sequence)
{
  if (sequence && sequence.sequenceIdentifier)
  {
    var Message = sequence.sequenceIdentifier(this._parser)
    if (Message)
      return Message
  }
}

/**
 * Writes the message to socket.
 * The event 'data' is emitted, making the stream flush data to socket.
 *
 * @param {String} ASCII string defined in the Telemetry Design Manual
 */
Protocol.prototype._emitMessage = function(message)
{
  this.emit('data', message.write())
}


/**
 * It queues the sequence if any.
 * 
 * @param {Object} that extends a {Sequence}
 */
Protocol.prototype._nextSequence = function (nextSequence)
{
  if (nextSequence && nextSequence instanceof Sequences.Sequence)
  {
    return this._enqueue(nextSequence)
  }
}

/**
 * Closes the stream.
 * The event 'end' is emitted, ending the stream. 
 */
Protocol.prototype.end = function ()
{  
  return this.emit('data', ':70 \n')
}

Protocol.prototype.destroy = function()
{
   this.connection = null
   this._queue = null
   this._parser = null
   this._decoder = null
   this.WsAPI = null
}

/**
 * @Deprecated
 */
Protocol.prototype._handshake = function ()
{
  if (!this._handshaked)
  {
    this._handshaked = true;
    this.emit('handshake');
  }
}