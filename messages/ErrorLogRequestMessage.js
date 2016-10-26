'use strict'

/**
@module messages
**/
module.exports = ErrorLogRequestMessage

/**
@class ErrorLogRequestMessage
@constructor
**/
function ErrorLogRequestMessage () {}


ErrorLogRequestMessage.prototype.start = function()
{
}

ErrorLogRequestMessage.prototype.write = function ()
{
  return ':12 \n'
}
