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
module.exports = EndControlModeRequest
Util.inherits(EndControlModeRequest, Sequence)

/**
@class EndControlModeRequest
@constructor
@extends Sequence
**/
function EndControlModeRequest(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
   this._seqId = machine.seqId
}


EndControlModeRequest.prototype.sequenceIdentifier = function (parser)
{
  return Messages.EndControlModeMessage
}


EndControlModeRequest.prototype['EndControlModeMessage'] = function (message)
{
  console.log('END Control Mode Request -> ' + JSON.stringify(message))
  if (message) {
    if (message.identifier == 41) {
       if (this._machineId && this._seqId)
        this.WsAPI.removeCommandFromMachine({ "machineId": this._machineId, "seqId": this._seqId }, function () {})
    }
  }
}

EndControlModeRequest.prototype.start = function()
{
  this.emit('packet', new Messages.EndControlModeMessage)
}