'use strict'

/**
@module messages
**/
module.exports = ParameterValueRequestMessage

/**
@class ParameterValueRequestMessage
@constructor
**/
function ParameterValueRequestMessage(parameters)
{
  this._parameters = parameters
}

ParameterValueRequestMessage.prototype.start = function()
{
}


ParameterValueRequestMessage.prototype.write = function ()
{
  if (this._parameters)
    return ':30 ' + this._parameters + '\n'
  return ':30 \n'
}
