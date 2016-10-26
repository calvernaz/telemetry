/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  Persistence = require('../api/persistence'),
  Messages = require('../messages'),
  DecoderUtils = require('../utils/DecodeUtils')

/**
@module sequences
**/
module.exports = EndConnectionRequest
Util.inherits(EndConnectionRequest, Sequence)

/**
@class ErrorLog
@constructor
@extends Sequence
**/
function EndConnectionRequest(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId

   this.decoderUtils = new DecoderUtils({})
}


EndConnectionRequest.prototype.sequenceIdentifier = function (parser)
{
  return Messages.EndConnectionRequestMessage
}

EndConnectionRequest.prototype['EndConnectionRequestMessage'] = function (message)
{
  if (message)
  { 
    if (this.decoderUtils.isAckMessage(message.identifier))
    {
     console.log('[BOS -> Machine ' + this._machineId + '] ( ' + DateFormat() + ' ) <- EndConnectionRequestMessage ACK')
    }
  }  
}

EndConnectionRequest.prototype.start = function()
{
  this.emit('packet', new Messages.EndConnectionRequestMessage);
}

