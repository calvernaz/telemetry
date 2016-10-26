'use strict'

/**
@module messages
**/
module.exports = ParameterValueChangeMessage

/**
@class ParameterValueChangeMessage
@constructor
**/
function ParameterValueChangeMessage () {}

ParameterValueChangeMessage.prototype.start = function()
{

}

ParameterValueChangeMessage.prototype.write = function ()
{
  return ':32 \n'
}
