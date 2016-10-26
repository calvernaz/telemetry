/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  Persistence = require('../api/persistence.js'),
  EndConnection = require('./EndConnectionRequest'),
  Messages = require('../messages')

module.exports = StorageWheelRequest
Util.inherits(StorageWheelRequest, Sequence)

/**
@class StorageWheelRequest
@constructor
@extends Sequence
**/
function StorageWheelRequest(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
   this._seqId = machine.seqId

   var Decoder = require('../Decoder')
   this._decoder = new Decoder({})
}

StorageWheelRequest.prototype.sequenceIdentifier = function (parser)
{
  return Messages.StorageWheelTableRequestMessage
}

StorageWheelRequest.prototype['StorageWheelTableRequestMessage'] = function (message)
{

  var self = this
  if (message.payload)
  {
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- ' + JSON.stringify(message))
    var record =  {
      "machineId": this._machineId,
      "position": message.payload.position,
      "status": message.payload.status,
      "timestamp": message.payload.timestamp,
      "productTableIndex": message.payload.productTableIndex,
    }
    this.WsAPI.insertStorageWheelRecord(record, this.responseHandler.bind(this))

  }
  else
  {
    // No Payload, it means no more record will be sent
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- StorageWheelTableRequestMessage EOL')

    // Remove the command, this code must be here in case of empty message
    this.removeCommand(this._machineId, this._seqId, function() {
    
      self['AcknowledgeMessage']({ "machineId": self._machineId }, true)

      // retrieve the next command from web service / database
      self.WsAPI.getCommandFromMachine({ "machineId": self._machineId }, self.getPreparedCommand.bind(self))
    })
  }

}


StorageWheelRequest.prototype.getPreparedCommand = function (err, result)
{
  if (err) throw err
  var self = this

  var r = JSON.parse(result.return)
  if (r.result == -1)
    return self.emit('nextsequence', new EndConnection({ "machineId" : self._machineId }, undefined))
  
  if (r.result.commandId == 60 && r.result.commandParameters == "02" && r.result.status && r.result.status == "1")
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


StorageWheelRequest.prototype.responseHandler = function (err, result)
{
  if (err) throw err

  var self = this
  var r = JSON.parse(result.return)
  if (r && r.result == -2)
  {
    this['NotAcknowledgeMessage'](undefined, true)
    return
  }
}

StorageWheelRequest.prototype.start = function()
{
  this.emit('packet', new Messages.StorageWheelTableRequestMessage)
}
