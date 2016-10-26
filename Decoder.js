/*jslint node: true */
/*jshint asi: true */
'use strict';

var _ = require('underscore')._,
  Util = require('util'),
  Parser = require('./Parser'),
  DecodeUtils = require('./utils/DecodeUtils'),
  Sequences = require('./sequences')

/**
* This class is used for dissecting the data from protocol.
*
@class Decoder
@param {Object} config
@constructor
@uses Parser
*/
module.exports = Decoder
function Decoder(config) {
  this._config = config || {}

  this._decodeUtils = new DecodeUtils()

  this._parser = this._config.parser || function () {}
}

/**
 * Decode message
 *
 * @param {String} identifier
 * @return an {Object}
 * @api public
 */
Decoder.prototype.decodeIdentifier = function (identifier)
{
  return _.findWhere(_messages, { id: identifier })
}

/* =================
 * Callbacks
 * ================= */

/**
 * Handles authentication
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.auth = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    imei: payload_tokens[0],
    version: payload_tokens[1],
    errorcode: payload_tokens[2],
    toString: function () {
      return "{ " + this.imei + "," + this.version + "," + this.errorcode + " }"
    }
  }
}

/**
 * Handles acknowledge
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.not_acknowledge = function (payload)
{
 var payload_tokens = this._decodeUtils.splitAndTrim(payload)

 return {
    error: payload_tokens[0]
  }
}

/**
 * Handles status report
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.status_report = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    mainStatus: payload_tokens[0],
    inputBottleStatus: payload_tokens[1],
    outputBottleStatus: payload_tokens[2],
    error: payload_tokens[3],
    mode: payload_tokens[4],
    totalDispensed: payload_tokens[5]
  }
}


/**
 * Handles dispense log record
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.dispense_log_record = function (payload)
{

  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    timestampProductOut: payload_tokens[0],
    wheelPosition: payload_tokens[1],
    barcode: payload_tokens[2],
    timestampProductIn: payload_tokens[3],
    toString: function () {
      return "{ " + this.timestampProductOut + "," + this.wheelPosition + "," + this.barcode + "," + this.timestampProductIn + " }"
    }
  }
}

/**
 * Handles error log record
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.error_log_record = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    timestamp: payload_tokens[0],
    errorNumber: payload_tokens[1],
    positionSliderIn: payload_tokens[2],
    positionInnerSliderOut: payload_tokens[3],
    positionOuterSliderOut: payload_tokens[4],
    positionStorageWheel: payload_tokens[5],
    controllerError: payload_tokens[6],
    errorLag: payload_tokens[7],
    errorWindow: payload_tokens[8],
    inputStatus: payload_tokens[9],
    toString: function () {
      return "{ " + this.timestamp + "," + this.errorNumber + "," + this.positionSliderIn + "," + this.positionInnerSliderOut + "," + this.positionOuterSliderOut + "," + this.positionStorageWheel + "," + this.controllerError + "," + this.errorLag + "," + this.errorWindow + "," + this.inputStatus + " }"
    }
  }
}

/**
 * Handles temperature log record
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.temperature_log_record = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    timestamp: payload_tokens[0],
    applicationTemperature: payload_tokens[1],
    condensorTemperature: payload_tokens[2],
    defrostTemperature: payload_tokens[3],
    toString: function () {
      return "{ " + this.timestamp + "," + this.applicationTemperature + "," + this.condensorTemperature + "," + this.defrostTemperature + " }"
    }
  }
}

/**
 * Handles storage wheel record
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.storage_wheel_record = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    position: payload_tokens[0],
    status: payload_tokens[1],
    timestamp: payload_tokens[2],
    productTableIndex: payload_tokens[3]
  }
}

/**
 * Handles product table record
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.product_table_record = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    index: payload_tokens[0],
    barcode: payload_tokens[1]
  }
}

/**
 * Handles parameter value
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.parameter_value = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    parameterNumber: payload_tokens[0],
    parameterValue: payload_tokens[1]
  }
}

/**
 * Handles parameter value change
 *
 * @param {String} payload
 * @return an {Object}
 * @api public
 */
Decoder.prototype.parameter_value_change = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    parameter_number: payload_tokens[0],
    new_value: payload_tokens[1]
  }
}

Decoder.prototype.command = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    command_number: payload_tokens[0],
    product_index: payload_tokens[1],
    reset: payload_tokens[2],
  }
}

Decoder.prototype.end_control_mode = function (payload)
{
  var payload_tokens = this._decodeUtils.splitAndTrim(payload)
  return {
    quit: payload_tokens[0]
  }
}


/**
 * Detect message
 *
 * @param {Boolean} true for debug, false otherwise
 * @return an {Object} with two properties, the identifier
 *   and payload of the message
 * @api public
 */
Decoder.prototype.decodeMessage = function (debug, tokenize) {
  var msg = {}
  var identifier, payload, parsedMessage

  parsedMessage = this._parser.getProcessedMessage()
  if (!parsedMessage) return null

  // Decode indentifer
  identifier = parsedMessage.slice(0, 2)
  msg.identifier = identifier

  // Decode payload
  payload = parsedMessage.slice(identifier.length)
  payload = payload.trim()

  if (payload.length > 0)
  {
    msg.payload = payload
  }

  if ('boolean' == typeof debug && debug)
  {
    var m = this.decodeIdentifier(msg.identifier)
    console.log('Message ' + m.name)
    if (msg.payload && m.parser)
      console.log('Payload: ' + m.parser(payload))
  }

  if ('boolean' == typeof tokenize && tokenize)
  {
    var msgDecoded = this.decodeIdentifier(msg.identifier)
    if (msg.payload && msgDecoded && msgDecoded.parser)
      msg.payload = this[msgDecoded.parser](payload)
  }

  return msg
}


/**
 * Tuples for messages described in
 * Telemetry Design Manual.
 */
var _messages =
[
  { id: '01', name: 'AUTHENTICATION', parser: "auth" },
  { id: '04', name: 'ACKNOWLEDGE', parser: null},
  { id: '05', name: 'NOT_ACKNOWLEDGE', parser: "not_acknowledge" },
  { id: '06', name: 'STATUS_REQUEST', sequence: Sequences.StatusRequest, parser: null },
  { id: '07', name: 'STATUS_REPORT', parser: "status_report" },
  { id: '10', name: 'DISPENSE_LOG_REQUEST', parser: null },
  { id: '11', name: 'DISPENSE_LOG_RECORD', parser: "dispense_log_record" },
  { id: '12', name: 'ERROR_LOG_REQUEST', parser: null},
  { id: '13', name: 'ERROR_LOG_RECORD', parser: "error_log_record" },
  { id: '14', name: 'TEMPERATURE_LOG_REQUEST', parser: null},
  { id: '15', name: 'TEMPERATURE_LOG_RECORD', parser: "temperature_log_record" },
  { id: '20', name: 'SW_TABLE_REQUEST', sequence: Sequences.StorageWheelRequest, parser: null},
  { id: '21', name: 'SW_TABLE_RECORD', parser: "storage_wheel_record" },
  { id: '22', name: 'PRODUCT_TABLE_REQUEST', sequence: Sequences.ProductTableRequest, parser: null},
  { id: '23', name: 'PRODUCT_TABLE_RECORD', parser: "product_table_record" },
  { id: '30', name: 'PARAMETER_VALUE_REQUEST', sequence: Sequences.ParameterValueRequest, parser: null},
  { id: '31', name: 'PARAMETER_VALUE', parser: "parameter_value" },
  { id: '32', name: 'PARAMETER_VALUE_CHANGE', sequence: Sequences.ParameterValueChange, parser: "parameter_value_change" },
  { id: '40', name: 'START_CONTROL_MODE', sequence: Sequences.StartControlModeRequest, parser: null},
  { id: '41', name: 'END_CONTROL_MODE', sequence: Sequences.EndControlModeRequest, parser: null},
  { id: '50', name: 'REQUEST_TO_UPLOAD_SOFTWARE', sequence: Sequences.UploadSoftwareRequest, parser: null},
  { id: '51', name: 'SOFTWARE_RECORD', parser: null},
  { id: '52', name: 'REBOOT', sequence: Sequences.RebootRequest, parser: null},
  { id: '60', name: 'COMMAND', sequence: Sequences.CommandRequest, parser: null},
  { id: '70', name: 'END_CONNECTION', sequence: Sequences.EndConnectionRequest, parser: null}
]

exports.MessagesIdentifiers = _messages
