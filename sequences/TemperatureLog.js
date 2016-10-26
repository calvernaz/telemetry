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
module.exports = TemperatureLog
Util.inherits(TemperatureLog, Sequence)


/**
@class TemperatureLog
@constructor
@extends Sequence
**/
function TemperatureLog(machine, callback)
{
 Sequence.call(this, callback)
 this.WsAPI = new Persistence()

 this._machineId = machine.machineId

 var Decoder = require('../Decoder')
 this._decoder = new Decoder({})
}

/**
 * 
 */
TemperatureLog.prototype.sequenceIdentifier = function (parser)
{
  return Messages.TemperatureLogRequestMessage
}

TemperatureLog.prototype['TemperatureLogRequestMessage'] = function (message)
{
  var self = this

  if (message.payload)
  {
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- ' + JSON.stringify(message))
    var record = {
      "machineId": this._machineId,
      "timestamp": message.payload.timestamp,
      "applicationTemperature": message.payload.applicationTemperature, 
      "condensorTemperature": message.payload.condensorTemperature,
      "defrostTemperature": message.payload.defrostTemperature
    }

    this.WsAPI.insertTemperatureLogRecord(record, this.responseHandler.bind(this))
  }
  else
  {
       // No Payload, it means no more records will be sent
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- TemperatureLogRequestMessage EOL')  
    
    // Acknowledge the end of sequence
    this['AcknowledgeMessage']({ "machineId": this._machineId }, true)
    
    // retrieve the next command from web service / database
    this.WsAPI.getCommandFromMachine({ "machineId": this._machineId }, this.getPreparedCommand.bind(this))
  }
}

TemperatureLog.prototype.responseHandler = function (err, result)
{
  if (err) throw err

  var self = this
  var r = JSON.parse(result.return)
  if (r && r.result == -2)
    this['NotAcknowledgeMessage'](undefined, true)

}

TemperatureLog.prototype.getPreparedCommand = function (err, result)
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


TemperatureLog.prototype.start = function()
{
  this.emit('packet', new Messages.TemperatureLogRequestMessage)
}

