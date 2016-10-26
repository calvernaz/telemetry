/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  TemperatureLog = require('./TemperatureLog'),
  Persistence = require('../api/persistence'),
  Messages = require('../messages')

/**
@module sequences
**/
module.exports = ErrorLog
Util.inherits(ErrorLog, Sequence)

/**
@class ErrorLog
@constructor
@extends Sequence
**/
function ErrorLog(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
}


ErrorLog.prototype.sequenceIdentifier = function (parser)
{
  return Messages.ErrorLogRequestMessage
}

ErrorLog.prototype['ErrorLogRequestMessage'] = function (message)
{

  var self = this
  if (message.payload)
  {
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- ' + JSON.stringify(message))   
    var record = {
      "machineId": this._machineId,
      "timestamp": message.payload.timestamp,
      "errorNumber": message.payload.errorNumber, 
      "posSliderIn": message.payload.positionSliderIn,
      "posInnerSliderOut": message.payload.positionInnerSliderOut,
      "posOuterSliderOut": message.payload.positionOuterSliderOut,
      "posStorageWheel": message.payload.positionStorageWheel,
      "controllerError": message.payload.controllerError,
      "errorLag": message.payload.errorLag,
      "errorWindow": message.payload.errorWindow,
      "inputStatus": message.payload.inputStatus
    }

    this.WsAPI.insertErrorLogRecord(record, this.responseHandler.bind(this))

  }
  else
  {

    // No Payload, it means no more record will be sent
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- ErrorLogRequestMessage EOL')
  
    this['AcknowledgeMessage']({ "machineId": this._machineId }, true)

    this.nextSequence(function ()
    {
      self.emit('nextsequence', new TemperatureLog({ "machineId" : self._machineId }, undefined))
    })
  }
}

ErrorLog.prototype.responseHandler = function (err, result)
{
  if (err) throw err

  var r = JSON.parse(result.return)
  if (r && r.result == -2)
    this['NotAcknowledgeMessage'](undefined, true)
}

ErrorLog.prototype.start = function()
{
  this.emit('packet', new Messages.ErrorLogRequestMessage);
}

