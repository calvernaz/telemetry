/*jslint node: true */
/*jshint asi: true */
'use strict';

var Util = require('util'),
  DateFormat = require('dateformat'),
  Sequence = require('./Sequence'),
  Persistence = require('../api/persistence.js'),
  Messages = require('../messages'),
  SoftwareRecord = require('./SoftwareRecord'),
  RebootRequest = require('./RebootRequest'),
  DecoderUtils = require('../utils/DecodeUtils'),
  FirmwareReader = require('../utils/FirmwareReader')

/**
@module sequences
**/
module.exports = UploadSoftwareRequest
Util.inherits(UploadSoftwareRequest, Sequence)

/**
@class UploadRequest
@constructor
@extends Sequence
**/
function UploadSoftwareRequest(machine, callback)
{
   Sequence.call(this, callback)
   this.WsAPI = new Persistence()

   this._machineId = machine.machineId
   this._seqId = machine.seqId
   this._path = null
   
   this.decoderUtils = new DecoderUtils({})

   this.fwReader = null
   this.lastRecord = null

   this.uploadStarted = false
   this.stop = false
   this.blockSize = 5
}


UploadSoftwareRequest.prototype.sequenceIdentifier = function (parser)
{
  return Messages.UploadSoftwareRequestMessage
}

UploadSoftwareRequest.prototype['UploadSoftwareRequestMessage'] = function (message)
{
  var self = this
  if (message)
  { 
    console.log('[Machine ' + this._machineId + ' -> BOS] UploadSoftwareRequestMessage ( ' + DateFormat() + ' ) <- ' + JSON.stringify(message))
    if (this.decoderUtils.isAckMessage(message.identifier))
    {
      if (!this.uploadStarted)
      {
        // Update block size property
        this.blockSize = message.payload

        // warn portal that machine has accepted the upload 
        this.WsAPI.updateMachineStatus({ "machineId": this._machineId, "inDirectMode": "1" }, function () {})

        this.WsAPI.getFirmware({ machineId: this._machineId }, this.responseToFirmwarePath.bind(this))

        // remove command from database
        if (this._machineId && this._seqId)
         this.WsAPI.removeCommandFromMachine({ "machineId": this._machineId, "seqId": this._seqId }, function () {})
      } 
      else 
      {
        if (!this.stop)
        {
          this['readFirmwareFile']()
        }
        else 
        {
         // remove sequence from queue
         this.end(null)
        }
      }
    } 
    else
    {
      console.log('Resend last record...')
      this.nextSequence(function ()
      {
        self.emit('packet', new Messages.SoftwareRecordMessage(self.lastRecord, self._machineId))
      })
    } 
  }
}

UploadSoftwareRequest.prototype.responseToFirmwarePath = function (err, result)
{
  if (err) throw err
  
  var self = this
  var data = JSON.parse(result.return)
  if (data && data.result && data.result.path && data.result.path.length > 0) {
    this._path = data.result.path
    this.fwReader = new FirmwareReader({ "path": data.result.path, "blockSize": self.blockSize })
    this.fwReader.readFile()
    this.uploadStarted = true
    this.fwReader.on('eof', self.readFirmwareFile.bind(this))
  }
}


UploadSoftwareRequest.prototype.readFirmwareFile = function ()
{
  var self = this
  if (this.fwReader.hasNextLine()) {

      var record = this.lastRecord = this.fwReader.nextBurst()
      this.nextSequence(function ()
      {
        self.emit('packet', new Messages.SoftwareRecordMessage(record, self._machineId))
      })
      
  } else {

    // close the reader and free resources
    this.fwReader.close()
    
    // update firmware update status
    this.WsAPI.resultFirmware({ "machineId": this._machineId, "path": this._path, "status": "1"}, function (err, result) {
      console.log('Result Firmware: ' + JSON.stringify(result))
    })

    console.log('[BOS -> Machine ' + self._machineId +  '] Finish sending firmware')
    this.nextSequence(function ()
    {
      self.close = true
      console.log('[BOS -> Machine ' + self._machineId + '] RebootMessage')
      self.emit('packet', new Messages.RebootMessage({ machineId : self._machineId, seqId: self._seqId}, undefined))
    })

  }
}

UploadSoftwareRequest.prototype.start = function()
{
  console.log('[BOS -> Machine ' + this._machineId +  '] Start sending firmware')
  this.emit('packet', new Messages.UploadSoftwareRequestMessage)
}
