'use strict'

/**
@module messages
**/
module.exports = EndConnectionRequestMessage

function EndConnectionRequestMessage () {}

EndConnectionRequestMessage.prototype.start = function ()
{

}

EndConnectionRequestMessage.prototype.write = function ()
{
  return ':70 \n'
}
