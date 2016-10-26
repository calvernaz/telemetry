'use strict'

/**
@module messages
**/
module.exports = CommandRequestMessage

/**
@class DispenseLogRequestMessage
@constructor
**/
function CommandRequestMessage(parameters) {
  this.parameters = parameters
}

CommandRequestMessage.prototype.start = function()
{
}

CommandRequestMessage.prototype.write = function ()
{
  if (this.parameters) {
    console.log('CommandRequestMessage -> 60 ' + this.parameters)
    return ':60 ' + this.parameters + ' \n'
  } else {
    console.log('CommandRequestMessage -> 60 ')
    return ':60 \n'
  }
}
