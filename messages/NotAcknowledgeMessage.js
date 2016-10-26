'use strict'

/**
@module messages
**/
module.exports = NotAcknowledgeMessage

/**
@class NotAcknowledgeMessage
@constructor
**/
function NotAcknowledgeMessage() {}

NotAcknowledgeMessage.prototype.start = function()
{
}

NotAcknowledgeMessage.prototype.write = function ()
{
  return ':05 \n'
}
