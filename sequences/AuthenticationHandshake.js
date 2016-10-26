/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
    DateFormat = require('dateformat'),
    Sequence = require('./Sequence'),
    DispenseLog = require('./DispenseLog.js'),
    Persistence = require('../api/persistence.js'),
    Messages = require('../messages')
  
/**
@module sequences
**/
module.exports = AuthenticationHandshake
Util.inherits(AuthenticationHandshake, Sequence)


/**
@class AuthenticationHandshake
@constructor
@extends Sequence
**/
function AuthenticationHandshake(config, callback)
{
  Sequence.call(this, callback)
  this._handshakeInitializationPacket = false
  this.WsAPI = new Persistence()
}

/**
 Identifies the message associated to this `Sequence`
 @method sequenceIdentifier
 @param  {Object} parser
 @return {Object} message associated to the Sequence
 */
AuthenticationHandshake.prototype.sequenceIdentifier = function (parser)
{
  if (!this._handshakeInitializationPacket)
  {
    return Messages.AuthenticationHandshakeMessage
  }
}

AuthenticationHandshake.prototype['AuthenticationHandshakeMessage'] = function (message)
{
  return this.processMessage(message)
}

/**
 Proccess the message
 @method processMessage
 @param {String} message
 @example `{ identifier: '01', payload: '355873847928122, v01, 00' }`
 */
AuthenticationHandshake.prototype.processMessage = function(message)
{
  var self = this 

  this.once('AuthenticationValid', function (authToken) {
    return self._authenticationValid(authToken)
  })
  .once('AuthenticationInvalid', function (errorCode, errorMessage) {
    return self._authenticationInvalid(errorCode, errorMessage)
  })

  var record = { 'imei': message.payload.imei, 'version': message.payload.version, 'errorCode': message.payload.errorcode }

  console.log('[Glacier ( ' + DateFormat () + ')] <- Authentication Request from: ' + JSON.stringify(record))
  
  // Check if IMEI exist in database
  this.WsAPI.auth(record, self.responseHandler.bind(this))

}

/**
 Response handler for WS call to authentication
 
 @method responseHandler
 @param  {Error} err
 @param  {Object} result
 @return AuthenticationValid in case of success, 
 AuthenticationInvalid in case of invalid authentication
 */
AuthenticationHandshake.prototype.responseHandler = function (err, result)
{
  if (err) throw err

  var r = JSON.parse(result.return)
  if (r && r.result && r.result > 0) {
    return this.emit('AuthenticationValid', { "machineId" : r.result })
  }
  return this.emit('AuthenticationInvalid')
}

/**
 * Handler for custom event 'AuthenticationValid'
 * @method _authenticationValid
 * @param  {String} authToken, a IMEI
 */
AuthenticationHandshake.prototype._authenticationValid = function (authToken)
{

  // Send Acknowledge message
  this['AcknowledgeMessage']({ "machineId": authToken.machineId }, true)

  var self = this
  this.nextSequence(function()
  {
    self.emit('nextsequence', new DispenseLog(authToken, undefined))
  })

}

/**
 * Handler for custom event 'AuthenticationValid'
 * @method _authenticationInvalid
 * 
 * @param  {String} Error code
 * @param  {String} Error message
 */
AuthenticationHandshake.prototype._authenticationInvalid = function (errorCode, errorMessage)
{
  this['NotAcknowledgeMessage'](undefined, true)
}
