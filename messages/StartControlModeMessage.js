'use strict'

/**
@module messages
**/
module.exports = StartControlModeMessage

function StartControlModeMessage() {}


StartControlModeMessage.prototype.start = function()
{
}

StartControlModeMessage.prototype.write = function ()
{
  return ':40 \n'
}
