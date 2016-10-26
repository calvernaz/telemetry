/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Messages = require('../messages'),
  Sequence = require('./Sequence'),
  DecoderUtils = require('../utils/DecodeUtils')

/**
@module sequences
**/
module.exports = SoftwareRecord
Util.inherits(SoftwareRecord, Sequence)


/**
 * @class SoftwareRecord
 * @constructor
 * @extends Sequence
 */
function SoftwareRecord(machine, callback)
{
  Sequence.call(this, callback)

  this._machineId = machine.machineId

  this.decoderUtils = new DecoderUtils({})
}

SoftwareRecord.prototype.sequenceIdentifier = function (parser)
{
  return Messages.SoftwareRecordMessage
}

SoftwareRecord.prototype['SoftwareRecordMessage'] = function (message)
{
  var self = this
  if (message)
  {
    if (this.decoderUtils.isAckMessage(message.identifier))
    {
    } else {
      // resend SSS-record
    }
  }  
}

SoftwareRecord.prototype.start = function()
{
  this.emit('packet', new Messages.SoftwareRecordMessage)
}