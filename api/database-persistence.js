'use strict'

var mysql = require('mysql'),
_ = require('underscore'),
Decoder = require('./Decoder.js')

module.exports = Logging
function Logging(options) {}

// PRODUCTION
var _defaults =
{
  host     : 'localhost',
  port     : 3306,
  user     : 'no-user',
  password : 'no-password-yet',
  database : 'schema'
}

var _config = _.extend(_defaults, {
  host     : process.env.MYSQL_HOST,
  port     : process.env.MYSQL_PORT,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD
});


// DEVELOPMENT
var _connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'no-user',
  password : 'no-password',
  database : 'schema'
});

Logging.prototype.check_authentication = function(record, responseHandler, log)
{
  // Split into tokens
  var authentication = Decoder.auth(record.payload)

  // Log if enable
  if (log) console.log(authentication)

  var result = []
  result.push({ IMEI_VALID: 1})
  responseHandler(undefined, result)
  // Query database for validation and execute callback
/*
  var query = _connection.query('SELECT COUNT(IMEI) as IMEI_VALID FROM MACHINE WHERE IMEI = ?', [authentication.imei],
    function (err, result)
    {
      if (err)
        responseHandler(err, undefined)
      responseHandler(undefined, result)
    })
  */
}

/**
 * Insert {Dispense Log Record} into DISPENSE_LOG table
 *
 * @param {Object} record
 * @throws error if something bad happened
 * @api public
 */
Logging.prototype.insert_dispense_log_record = function(record)
 {
  var query = _connection.query('INSERT INTO TELEMETRY.DISPENSE_LOG SET ?', record,
    function(err, result)
    {
      if (err) throw err
    }
  )
}


/**
 * Insert {Error Log Record} into ERROR_LOG table
 *
 * @param {Object} record
 * @throws error if something bad happened
 * @api public
 */
 Logging.prototype.insert_error_log_record = function(record)
 {
  var query = _connection.query('INSERT INTO TELEMETRY.ERROR_LOG SET ?', record,
    function(err, result)
    {
      if (err) throw err
    }
  )
}

/**
 * Insert {Temperature Log Record} into TEMPERATURE_LOG table
 *
 * @param {Object} record
 * @throws error if something bad happened
 * @api public
 */
 Logging.prototype.insert_temperature_log_record = function(record)
 {
  var query = _connection.query('INSERT INTO TELEMETRY.TEMPERATURE_LOG SET ?', record,
    function(err, result)
    {
      if (err) throw err
    }
  )
}

Logging.prototype.insert_default_parameters_values = function (record)
{
  var query = _connection.query('INSERT INTO TELEMETRY.PARAMETERS_BASE SET ?', record,
    function(err, result)
    {
      if (err) throw err
    }
  )
  query.end()
}
