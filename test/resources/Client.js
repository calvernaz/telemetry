'use strict'

var util = require('util'),
  tcp = require('net'),
  readline = require('readline'),
  fs = require('fs'),
  Decoder = require('../../Decoder.js'),
  Constants = require('../../constants/Constants.js'),
  EventEmitter = require('events').EventEmitter


module.exports = Client
util.inherits(Client, EventEmitter)

function Client (host, port) {
  this.host = host || 'localhost'
  this.port = port || Constants.SERVER_PORT_LISTEN
  this.conn = null
  this.buffer = ''
  this.callbacks = []
  this.queryString = ''
}



Client.prototype.connect = function () {

  if (!this.conn) {
   this.conn = new tcp.createConnection(this.port, this.host);
   var self = this;

   this.conn.addListener ("connect",
    function ()
    {
      this.setTimeout(0)
      this.setNoDelay()

      self.emit ("connect")
      self.init()
    })
 }

 this.conn.addListener("data",
  function (data)
  {
    self.buffer += data
    self.handle_response()
  })

 this.conn.addListener("end",
  function ()
  {
    if (self.conn && self.conn.readyState) {
      self.conn.end();
      self.conn = null;
    }
  })

 this.conn.addListener("close",
  function ()
  {
    self.conn = null;
    self.emit("close");
  })

 this.conn.addListener("timeout",
  function ()
  {
    self.conn = null;
    self.emit("timeout");
  })

 this.conn.addListener("error", 
  function (ex)
  {
    self.conn = null;
    self.emit("error", ex);
  })
}

Client.prototype.init = function ()
{
  this.authentication()
}

Client.prototype.authentication = function (response)
{
  this.query(':01 012896005265159,109,2',
    function ()
    { 
      console.log('authentication succesfull') 
    })
}

Client.prototype.query = function (query, callback)
{
  this.callbacks.push({ cb: callback });
  this.conn.write (query + Constants.CRLF);
}

Client.prototype.handle_response = function ()
{
  if (this.buffer.length > 0) {
    // not a complete message
    var crlf_at = this.buffer.indexOf(Constants.CRLF)
    if (crlf_at == -1)
    {
     return null;
    }
   
    // lets split messages
    var messages = this.buffer.trim().split(Constants.CRLF)
    this.buffer = '';
    for(var i=0; i < messages.length; i++)
    { 
        var msg = this._extractDelimiters(messages[i])
        console.log('Message ID: ' + msg)
        this.process(msg)
    }

  }
}

Client.prototype._extractDelimiters = function (message)
{

  var newMessage, syncMark

  syncMark = message.trim().indexOf(':')

  if (syncMark == -1) return null
  
  newMessage = message.substring(syncMark+1, message.length)
  return newMessage
}

Client.prototype.process = function (type, message)
{
  if (type == '10') {
    this.query(':11')
  } else if (type == '12') {
    this.sendMessage('./messages/error_logs.msg')
  } else if (type == '14') {
    this.sendMessage('./messages/temperature_logs.msg')
  } else if (type == '40') {
    this.query(':04')
  } else if (type == '70') {
    this.conn.end()
  }
}

Client.prototype.sendMessage = function(messages) {

  var self = this
  var rl = readline.createInterface({
    input: fs.createReadStream(messages),
    output: process.stdout,
    terminal: false
  })

  rl.on('line', function (cmd) {
    self.query(cmd)
  }).on('close', function () {

  })  
}


var client = new Client()
client.connect()










