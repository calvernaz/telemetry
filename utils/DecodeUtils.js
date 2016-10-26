/*jslint node: true */
/*jshint asi: true */
'use strict';

var _ = require('underscore')

module.exports = DecodeUtils
function DecodeUtils() {}

DecodeUtils.prototype.splitAndTrim = function (payload)
{
  return _.map(payload.split(','), function (token)
  {
    return token.trim()
  })
}

DecodeUtils.prototype.isAckMessage = function(identifier)
{
  return identifier == "04"
}