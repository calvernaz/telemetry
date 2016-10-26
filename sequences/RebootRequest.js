/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  Persistence = require('../api/persistence.js'), 
  Messages = require('../messages')

/**
@module sequences
**/
module.exports = RebootRequest
Util.inherits(RebootRequest, Sequence)

/**
@class RebootRequest
@constructor
@extends Sequence
**/
function RebootRequest(machine, callback)
{
   Sequence.call(this, callback)

   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
   this._seqId = machine.seqId
}

RebootRequest.prototype.sequenceIdentifier = function (parser)
{
  return Messages.RebootMessage
}

RebootRequest.prototype['RebootMessage'] = function (message)
{
  
  var self = this
  if (message)
  {
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- ' + JSON.stringify(message)) 
    if (self._machineId && self._seqId)
      this.WsAPI.removeCommandFromMachine({ "machineId": self._machineId, "seqId": self._seqId }, function () {})

    // Acknowledge the end of sequence
    this['AcknowledgeMessage']({ "machineId": this._machineId }, true)
  }
}

RebootRequest.prototype.start = function()
{
  this.emit('packet', new Messages.RebootMessage)
}
