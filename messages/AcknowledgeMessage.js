'use strict'

/**
@module messages
**/
module.exports = AcknowledgeMessage

/**
@class AcknowledgeMessage
@constructor
**/
function AcknowledgeMessage() {}

AcknowledgeMessage.prototype.write = function ()
{
  return ':04 \n'
}
