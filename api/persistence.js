/*jslint node: true */
/*jshint asi: true */
'use strict';

var soap = require('soap'),
BasicAuthSecurity = require('soap').BasicAuthSecurity,
_ = require('underscore')

/**
@module api
**/
module.exports = WsAPI

var _defaultConfig = {
  user     : 'user',
  password : 'password',
  wsdl : 'http://user:user@domain?wsdl',
  debug: false
}

// PRODUCTION
/*
var _config = _.extend(_defaultConfig, {
  host     : process.env.WS_HOST,
  port     : process.env.WS_PORT,
  user     : process.env.WS_USER,
  password : process.env.WS_PASSWORD,
  wsdl: process.env.WS_WSDL
})
*/


/**
@class WsAPI
@constructor
**/
function WsAPI(config)
{
  this._config = config || _defaultConfig
  this._debug = this._config.debug || false
  this._basicSecurity = new BasicAuthSecurity(this._config.user, this._config.password)

}

WsAPI.prototype.auth = function (record, responseHandler)
{
  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error;

    client.setSecurity(self._basicSecurity)
    client.auth(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}

/**
Insert record in table of dispense logs.
@method insertDispenseLogRecord
**/
WsAPI.prototype.insertDispenseLogRecord = function (record, responseHandler)
{

 var self = this
 soap.createClient(this._config.wsdl, function (error, client)
 {
  if (error) throw error

  client.setSecurity(self._basicSecurity)
  client.insertDispenseLogRecord(JSON.stringify(record), function (err, result) {
    if (err) throw err
    if (self._debug) console.log(result)

    return responseHandler(err, result)
  })
 })
}

/**
 Insert record in table of error logs.
 @method insertErrorLogRecord
 **/
 WsAPI.prototype.insertErrorLogRecord = function (record, responseHandler)
 {

  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.insertErrorLogRecord(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}

/**
Insert record in table of temperature logs.
@method insertTemperatureLog
**/
WsAPI.prototype.insertTemperatureLogRecord = function (record, responseHandler)
{

 var self = this
 soap.createClient(this._config.wsdl, function (error, client)
 {
  if (error) throw error

    client.setSecurity(self._basicSecurity)
  client.insertTemperatureLog(JSON.stringify(record), function (err, result) {
    if (err) throw err
      if (self._debug) console.log(result)

        return responseHandler(err, result)
    })
})
}

/**
Insert record in table of status report
@method insertStatusRecord
**/
WsAPI.prototype.insertStatusRecord = function (record, responseHandler)
{

 var self = this
 soap.createClient(this._config.wsdl, function (error, client)
 {
  if (error) throw error

  client.setSecurity(self._basicSecurity)
  client.insertStatusRecord(JSON.stringify(record), function (err, result) {
    if (err) throw err
      if (self._debug) console.log(result)

        return responseHandler(err, result)
    })
})
}


/**
Insert record in table of storage wheel.
@method insertStorageWheelRecord
**/
WsAPI.prototype.insertStorageWheelRecord = function (record, responseHandler)
{

  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.insertStorageWheelRecord(JSON.stringify(record), function (err, result)
    {
      if (err) throw err
        if (self._debug) console.log(result)

          return responseHandler(err, result)
      })
  })
}

/**
Insert record in table of product.
@method insertProductTableRecord
**/
WsAPI.prototype.insertProductTableRecord = function (record, responseHandler)
{

 var self = this
 soap.createClient(this._config.wsdl, function (error, client)
 {
  if (error) throw error

  client.setSecurity(self._basicSecurity)
  client.insertProductTableRecord(JSON.stringify(record), function (err, result)
  {
    if (err) throw err
    if (self._debug) console.log(result)

    return responseHandler(err, result)
  })
 })
}

/**
Insert record in table of parameter value.
@method insertParamaterValue
**/
WsAPI.prototype.insertParameterValue = function (record, responseHandler)
{

 var self = this
 soap.createClient(this._config.wsdl, function (error, client)
 {
  if (error) throw error

  client.setSecurity(self._basicSecurity)
  client.insertParameterValue(JSON.stringify(record), function (err, result) {
    if (err) throw err
    if (self._debug) console.log(result)

    return responseHandler(err, result)
  })
 })
}

/**
Retrieve command from machine
@method getCommandFromMachine
**/
WsAPI.prototype.getCommandFromMachine = function (record, responseHandler)
{
  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.getCommandFromMachine(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}

/**
Remove command from machine
@method removeCommandFromMachine
**/
WsAPI.prototype.removeCommandFromMachine = function (record, responseHandler)
{
  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.removeCommandFromMachine(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}


/**
Insert command
@method insertCommand
**/
WsAPI.prototype.insertCommand = function (record, responseHandler)
{
  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.insertCommand(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}

/**
Retrieve firmware info
@method getFirmware
**/
WsAPI.prototype.getFirmware = function (record, responseHandler)
{
  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.getFirmware(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}


/**
Retrieve firmware info
@method getFirmware
**/
WsAPI.prototype.resultFirmware = function (record, responseHandler)
{
  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.resultFirmware(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}

/**
Flag the end of sequence
@method resultSequence
**/
WsAPI.prototype.resultSequence = function (record, responseHandler)
{
  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.resultSequence(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}

/**
@method resultCommand
**/
WsAPI.prototype.resultCommand = function (record, responseHandler)
{
  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.resultCommand(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}

WsAPI.prototype.updateMachineStatus = function (record, responseHandler)
{

  var self = this
  soap.createClient(this._config.wsdl, function (error, client)
  {
    if (error) throw error

    client.setSecurity(self._basicSecurity)
    client.updateMachineStatus(JSON.stringify(record), function (err, result) {
      if (err) throw err
      if (self._debug) console.log(result)

      return responseHandler(err, result)
    })
  })
}
