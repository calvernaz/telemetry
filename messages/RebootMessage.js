'use strict'

/**
@module messages
**/
module.exports = RebootMessage

function RebootMessage() {}

RebootMessage.prototype.start = function()
{

  this.emit('packet', this);
}

RebootMessage.prototype.write = function ()
{
  console.log('[BOS] -> RebootMessage')
  return ':52 \n'
}
