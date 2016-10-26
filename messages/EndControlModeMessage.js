'use strict'

/**
@module messages
**/
module.exports = EndControlModeMessage

function EndControlModeMessage() {}

EndControlModeMessage.prototype.start = function()
{

}

EndControlModeMessage.prototype.write = function ()
{
  return 'QUIT \n'
}

