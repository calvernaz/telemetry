/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  Sequence = require('./Sequence'),
  DateFormat = require('dateformat'),
  Persistence = require('../api/persistence.js'), 
  Messages = require('../messages'),
  EndConnection = require('./EndConnectionRequest'),
  DecoderUtils = require('../utils/DecodeUtils')

  module.exports = CommandRequest
  Util.inherits(CommandRequest, Sequence)

/**
@class CommandRequest
@constructor
@extends Sequence
**/
function CommandRequest(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
   this._seqId = machine.seqId
   this._commandParameters = machine.commandParameters

   this.decoderUtils = new DecoderUtils({})

   var Decoder = require('../Decoder')
   this._decoder = new Decoder({})

}

CommandRequest.prototype.sequenceIdentifier = function (parser)
{
  return Messages.CommandRequestMessage
}

CommandRequest.prototype['CommandRequestMessage'] = function (message)
{
  var self = this
  if (message)
  {

   if (this.decoderUtils.isAckMessage(message.identifier)) {

      console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- AcknowledgeMessage')

      // flag that ACK is received
      console.log('Command parameters: ' + self._commandParameters)
      if (self._commandParameters == "02") {
        this.WsAPI.resultCommand({ "machineId": this._machineId, "commandId": "60", "commandParameters":"02", "status": "1"}, function () {
           console.log('Result Command')
           self.emit('end')
           return self.emit('nextsequence', new EndConnection({ "machineId" : self._machineId }, undefined))
        })

      } else {
        // Remove the command, this code must be here in case of empty message
        this.removeCommand(this._machineId, this._seqId, function() {
           self.emit('end')
           self.WsAPI.getCommandFromMachine({ "machineId": self._machineId }, self.getPreparedCommand.bind(self))
        })
     }

    } else {

     console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- NotAcknowledgeMessage')
     this.WsAPI.resultCommand({ "machineId": this._machineId, "commandId": "60", "commandParameters": self._commandParameters, "status": -1 }, function () {

       if (self._machineId && self._seqId && self._commandParameters != "02") {
         self.WsAPI.removeCommandFromMachine({ "machineId": self._machineId, "seqId": self._seqId }, function () {
           self.emit('end')
           self.WsAPI.getCommandFromMachine({ "machineId": self._machineId }, self.getPreparedCommand.bind(self))
         })
       } else {
           self.emit('end')
           return self.emit('nextsequence', new EndConnection({ "machineId" : self._machineId }, undefined))
       }

     })
    }
  }

}

CommandRequest.prototype.getPreparedCommand = function (err, result)
{
  if (err) throw err
  var self = this

 var r = JSON.parse(result.return)
 if (r.result == -1)
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

CommandRequest.prototype.start = function()
{
  this.emit('packet', new Messages.CommandRequestMessage(this._commandParameters))
}