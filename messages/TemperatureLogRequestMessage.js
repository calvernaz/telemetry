'use strict'

/**
@module messages
**/
module.exports = TemperatureLogRequestMessage

/**
@class TemperatureLogRequestMessage
@constructor
**/
function TemperatureLogRequestMessage () {}


TemperatureLogRequestMessage.prototype.start = function()
{
}


TemperatureLogRequestMessage.prototype.write = function ()
{
  return ':14 \n'
}
