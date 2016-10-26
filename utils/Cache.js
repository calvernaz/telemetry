'use strict'

var cache = {}

exports.put = function(key, value) {
  cache[key] = value
}

exports.delete = function(key) {
  delete cache[key]
}

exports.clear = function() {
  cache = {}
}

exports.get = function(key) {
  var data = cache[key]
  if (typeof data != "undefined")
  {
      return data
  }
  return null
}