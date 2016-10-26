/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  Messages = require('../messages'),
  Persistence = require('../api/persistence.js'),
  DateFormat = require('dateformat'),
  EventEmitter   = require('events').EventEmitter


/**
@module sequences
**/
module.exports = Sequence
Util.inherits(Sequence, EventEmitter)


/**
@class Sequence
@constructor
@extends EventEmitter
**/
function Sequence(callback)
{
  EventEmitter.call(this)

  this.WsAPI = new Persistence()

  this._callback = callback
  this._ended = false
}

Sequence.prototype['AcknowledgeMessage'] = function(message, log)
{
  if (log)
    console.log('[BOS -> Machine ' + message.machineId + '] ( ' + DateFormat() + ' ) AcknowledgeMessage')
     

  this.end(null)

  this.emit('packet', new Messages.AcknowledgeMessage());
  
}

Sequence.prototype['NotAcknowledgeMessage'] = function (message, log)
{
  if (log) console.log('[BOS] -> NotAcknowledgeMessage')

  this.end(null)

  this.emit('packet', new Messages.NotAcknowledgeMessage());

}

Sequence.prototype.removeCommand = function (machineId, seqId, fn)
{
  if (machineId && seqId)
    this.WsAPI.removeCommandFromMachine({ "machineId": machineId, "seqId": seqId }, fn)

}

Sequence.prototype.nextSequence = function (fn)
{
  process.nextTick(fn)
}

/**
 * Emit 'END' to dequeue sequence
 */
Sequence.prototype.end = function(err)
{
  if (this._ended) { return }

  this._ended = true

  try
  {
    if (err) { this.emit('error', err) }
  }
  finally 
  {
    try
    {
      if (this._callback)
      {
        this._callback.apply(this, arguments)
      }
    }
    finally 
    {
      this.emit('end')
    }
  }
}


// Implemented by child classes
Sequence.prototype.start = function() {}