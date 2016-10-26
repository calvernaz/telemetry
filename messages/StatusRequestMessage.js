'use strict'

/**
@module messages
**/
module.exports = StatusRequestMessage

/**
@class StatusRequestMessage
@constructor
**/
function StatusRequestMessage() {}

StatusRequestMessage.prototype.start = function()
{
}

StatusRequestMessage.prototype.write = function ()
{
  console.log('[BOS] -> StatusRequestMessage')
  return ':06 \n'
}
