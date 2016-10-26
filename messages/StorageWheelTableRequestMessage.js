'use strict'

/**
@module messages
**/
module.exports = StorageWheelTableRequestMessage

/**
@class StorageWheelTableMessage
@constructor
**/
function StorageWheelTableRequestMessage() {}

StorageWheelTableRequestMessage.prototype.start = function()
{
}

StorageWheelTableRequestMessage.prototype.write = function ()
{
  return ':20 \n'
}
