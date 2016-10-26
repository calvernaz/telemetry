/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  Persistence = require('../api/persistence.js'),
  EndConnection = require('./EndConnectionRequest'),
  Messages = require('../messages')

module.exports = StatusRequest
Util.inherits(StatusRequest, Sequence)

/**
@class StatusRequest
@constructor
@extends Sequence
**/
function StatusRequest(machine, callback)
{
   Sequence.call(this, callback)  
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
   this._seqId = machine.seqId

   var Decoder = require('../Decoder')
   this._decoder = new Decoder({})
}

StatusRequest.prototype.sequenceIdentifier = function (parser)
{
  return Messages.StatusRequestMessage
}

StatusRequest.prototype['StatusRequestMessage'] = function (message)
{  
 
  var self = this
  if (message.payload)
  {
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- ' + JSON.stringify(message)) 
    var record = {
      "machineId": this._machineId,
      "mainStatus": message.payload.mainStatus,
      "inputBottleStatus": message.payload.inputBottleStatus,
      "outputBottleStatus": message.payload.outputBottleStatus,
      "error": message.payload.error,
      "mode": message.payload.mode,
      "totalDispensed": message.payload.totalDispensed
    }

    this.WsAPI.insertStatusRecord(record, self.responseHandler.bind(this))
  } 
  else 
  {

    // No Payload, it means no more records will be sent
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- StatusRequestMessage EOL')
  
    // Remove the command, this code must be here in case of empty message
    this.removeCommand(this._machineId, this._seqId, function() {})
  
    // Acknowledge the end of sequence
    this['AcknowledgeMessage']({ "machineId": this._machineId }, true)

    // retrieve the next command from web service / database
    this.WsAPI.getCommandFromMachine({ "machineId": this._machineId }, self.getPreparedCommand.bind(this))
  }
}

StatusRequest.prototype.getPreparedCommand = function (err, result)
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
    if (sequence && msg.sequence) {
      var sequence = msg.sequence
      self.emit('nextsequence', new sequence({ "machineId" : self._machineId, "seqId": r.result.seqId, "commandParameters": r.result.commandParameters}, undefined))
    }
  })
}


StatusRequest.prototype.responseHandler = function (err, result)
{
  if (err) throw err

  var self = this
  var r = JSON.parse(result.return)
  if (r && r.result == -2)
  {
    this['NotAcknowledgeMessage'](undefined, true)
    return
  }

  // Acknowledge by BOS
  this['AcknowledgeMessage'](undefined, true)

  /* Special case */
  // Remove the command, this code must be here in case of empty message
  this.removeCommand(this._machineId, this._seqId, function() {
      // retrieve the next command from web service / database
      self.WsAPI.getCommandFromMachine({ "machineId": self._machineId }, self.getPreparedCommand.bind(self))
  })


}

StatusRequest.prototype.start = function()
{
  this.emit('packet', new Messages.StatusRequestMessage)
}

