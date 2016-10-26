/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  ErrorLog = require('./ErrorLog.js'),  
  Persistence = require('../api/persistence.js'),
  Messages = require('../messages')


module.exports = DispenseLog
Util.inherits(DispenseLog, Sequence)

/**
@class DispenseLog
@constructor
@extends Sequence
**/
function DispenseLog(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
}

DispenseLog.prototype.sequenceIdentifier = function (parser)
{
  return Messages.DispenseLogRequestMessage
}

DispenseLog.prototype['DispenseLogRequestMessage'] = function (message)
{
  var self = this

  if (message.payload)
  {   
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- ' + JSON.stringify(message))
    var record = { 
      'machineId': this._machineId,
      'barcode' : message.payload.barcode,
      'timestampProductOut': message.payload.timestampProductOut,
      'wheelPos': message.payload.wheelPosition,
      'timestampProductIn': message.payload.timestampProductIn
    }

    // Insert record into database
    this.WsAPI.insertDispenseLogRecord(record, self.responseHandler.bind(this))
  }
  else
  {
    // No Payload, it means no more record will be sent
    console.log('[Machine ' + this._machineId + ' -> BOS] ( ' + DateFormat() + ' ) <- DispenseLogRequestMessage EOL')

    // Send Acknowledge message
    this['AcknowledgeMessage']({ "machineId": this._machineId }, true)

    process.nextTick(function()
    {
      self.emit('nextsequence', new ErrorLog({ "machineId" : self._machineId }, undefined))
    })
  }
}

DispenseLog.prototype.responseHandler = function (err, result)
{
  if (err) throw err

  var r = JSON.parse(result.return)
  if (r && r.result == -2)
    this['NotAcknowledgeMessage'](undefined, true)
}

DispenseLog.prototype.start = function()
{
  this.emit('packet', new Messages.DispenseLogRequestMessage);
}
