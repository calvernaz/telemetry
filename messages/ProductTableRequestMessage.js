'use strict'

/**
@module messages
**/
module.exports = ProductTableRequestMessage

/**
@class ProductTableRequestMessage
@constructor
**/
function ProductTableRequestMessage() {}

ProductTableRequestMessage.prototype.start = function()
{
}

ProductTableRequestMessage.prototype.write = function ()
{
  return ':22 \n'
}
