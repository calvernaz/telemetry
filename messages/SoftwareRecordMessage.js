'use strict'

/**
@module messages
**/
module.exports = SoftwareRecordMessage

/**
@class SoftwareRecordMessage
@constructor
**/
function SoftwareRecordMessage (record, machineId)
{
  this.record = record
  this.machineId = machineId
}


SoftwareRecordMessage.prototype.start = function()
{
}


SoftwareRecordMessage.prototype.write = function ()
{
 console.log('[BOS -> Machine ' + this.machineId +  ']\n'  + this.record)
  return this.record
}
