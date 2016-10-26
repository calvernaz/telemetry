'use strict'

/**
@module messages
**/
module.exports = UploadSoftwareRequestMessage

function UploadSoftwareRequestMessage() {}

UploadSoftwareRequestMessage.prototype.start = function()
{

}

UploadSoftwareRequestMessage.prototype.write = function ()
{
  return ':50 \n'
}


