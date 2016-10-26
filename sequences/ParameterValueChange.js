/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  Messages = require('../messages'),
  EndConnection = require('./EndConnectionRequest'),
  Persistence = require('../api/persistence')

/**
@module sequences
**/
module.exports = ParameterValueChange
Util.inherits(ParameterValueChange, Sequence)


/**
@class ParameterValueChange
@constructor
@extends Sequence
**/
function ParameterValueChange(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
   this._seqId = machine.seqId
   this._commandParameters = machine.commandParameters

   var Decoder = require('../Decoder')
   this._decoder = new Decoder({})
}

ParameterValueChange.prototype.sequenceIdentifier = function (parser)
{
   return Messages.ParameterValueChangeMessage 
}


ParameterValueChange.prototype['ParameterValueChangeMessage'] = function (message)
{
  var self = this
  if (message)
  {
    // No Payload, it means no more record will be sent
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' )] <- ParameterValueChangeMessage EOL')

    // Remove the command, this code must be here in case of empty message
    this.removeCommand(this._machineId, this._seqId, function() {})
  
    if (this.decoderUtils.isAckMessage(message.identifier))
    {
      // retrieve the next command from web service / database
      this.WsAPI.getCommandFromMachine({ "machineId": this._machineId }, self.getPreparedCommand.bind(this))
    }
  }
}

ParameterValueChange.prototype.getPreparedCommand = function (err, result)
{
  if (err) throw err
  var self = this

  var r = JSON.parse(result.return)
  if (r.result == -1)
    return self.emit('nextsequence', new EndConnection({ "machineId" : self._machineId }, undefined))
  
  if (r.result.commandId == 60 && r.result.status && r.result.status == "1")
    return self.emit('nextsequence', new EndConnection({ "machineId" : self._machineId }, undefined))
  
  this.nextSequence(function ()
  {
    var msg = self._decoder.decodeIdentifier(r.result.commandId)
    if (msg && msg.sequence) {
      var sequence = msg.sequence
      self.emit('nextsequence', new sequence({ "machineId" : self._machineId, "seqId": r.result.seqId, "commandParameters": r.result.commandParameters }, undefined))
    }
  })
}

ParameterValueChange.prototype.responseHandler = function (err, result)
{
  if (err) throw err

  var self = this
  var r = JSON.parse(result.return)
  if (r && r.result == -2)
  {
    this['NotAcknowledgeMessage']({ "machineId": this._machineId }, true)
    return
  }
}


ParameterValueChange.prototype.start = function()
{
  this.emit('packet', new Messages.ParameterValueChangeMessage(this._commandParameters))
}

