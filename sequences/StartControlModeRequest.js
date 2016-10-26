/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  Persistence = require('../api/persistence.js'), 
  Messages = require('../messages'),
  EndControlModeRequest = require('./EndControlModeRequest'),
  DecoderUtils = require('../utils/DecodeUtils')

/**
@module sequences
**/
module.exports = StartControlModeRequest
Util.inherits(StartControlModeRequest, Sequence)


/**
@class StartControlModeRequest
@constructor
@extends Sequence
**/
function StartControlModeRequest(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
   this._seqId = machine.seqId

   this.decoderUtils = new DecoderUtils({})
}

StartControlModeRequest.prototype.sequenceIdentifier = function (parser)
{
  return Messages.StartControlModeMessage
}

StartControlModeRequest.prototype['StartControlModeMessage'] = function (message)
{
  if (message)
  {
    if (this.decoderUtils.isAckMessage(message.identifier))
    {
      console.log('Acknowledge message received, start control mode')

      if (this._machineId && this._seqId)
        this.WsAPI.removeCommandFromMachine({ "machineId": this._machineId, "seqId": this._seqId }, function () {})
      
      this['AcknowledgeMessage']({ "machineId": this._machineId }, true)
      this.emit('directmode', 
        { request: new EndControlModeRequest({ "machineId" : this._machineId, "seqId": this._seqId }, undefined), port: this._machineId })

    } else {
      console.log('StartControlModeMessage NACK')
    }
  }
}

StartControlModeRequest.prototype.start = function()
{
  this.emit('packet', new Messages.StartControlModeMessage)
}