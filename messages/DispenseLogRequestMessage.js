'use strict'

/**
@module messages
**/
module.exports = DispenseLogRequestMessage

/**
@class DispenseLogRequestMessage
@constructor
**/
function DispenseLogRequestMessage() {}

DispenseLogRequestMessage.prototype.start = function()
{
}

DispenseLogRequestMessage.prototype.write = function ()
{
  return ':10 \n'
}
