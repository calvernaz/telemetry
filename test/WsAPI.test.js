'use strict'

var assert = require('assert'),
Persistence = require('../api/persistence.js'),
should = require('should')


describe('WsAPI', function() {

  var config = {
    user     : 'user',
    password : 'password',
    wsdl : 'http://user:user@domain?wsdl',
    debug: false
  }

  var WsAPI = new Persistence(config)

  describe('#auth()', function () {
    it('should validate imei', function (done) {
      var record = { 'imei': '012896005265159' }
      WsAPI.auth(record, function (err, result) {
        result.should.be.a('object')
        result.should.have.property('return')
        result.return.should.be.a('string')

        var r = JSON.parse(result.return)
        r.should.have.property('result', 1)
      })
      done()
    })

    it('should return -1 in case of empty auth object', function (done) {
      var record = {}
      WsAPI.auth(record, function (err, result) {
        result.should.be.a('object')
        result.should.have.property('return')
        result.return.should.be.a('string')

        var r = JSON.parse(result.return)
        r.should.have.property('result', -3)
      })
      done()
    })

    it('should return -1 in case of invalid auth object', function (done) {
      var record = { 'imei': '111111111111111111110'}
      WsAPI.auth(record, function (err, result) {
        result.should.be.a('object')
        result.should.have.property('return')
        result.return.should.be.a('string')

        var r = JSON.parse(result.return)
        r.should.have.property('result', -3)
      })
      done()
    })


    it('should return -1 in case of invalid auth object', function (done) {
      var record = { 'emie': '000000000000000000001'}
      WsAPI.auth(record, function (err, result) {
        result.should.be.a('object')
        result.should.have.property('return')
        result.return.should.be.a('string')

        var r = JSON.parse(result.return)
        r.should.have.property('result', -3)
      })
      done()
    })
  })

describe('#insertDispenseLogRecord()', function () {

  it('should insert correctly dispense log record', function (done) {

    var record = {
      'machineId': "1",
      'barcode' :"963258",
      'timestampProductOut': "1371152474",
      'wheelPos':"12",
      'timestampProductIn':"34343534534"
    }

    WsAPI.insertDispenseLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')
      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
    done()
  })

  it ('should return -2 in case of invalid, empty properties, dispense log', function (done) {
    var record = {
      'machineId': '1',
      'barcode' :'',
      'timestamp': "-1",
      'wheelPos':'',
      'timestampProductIn':''
    }

    WsAPI.insertDispenseLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })


  it('should return -1 in case of empty dispense object', function (done) {
    var record = {}
    WsAPI.insertDispenseLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })
})

describe('#insertErrorLogRecord()', function () {
  it('should insert correctly error log record', function (done) {
    var record = {
      "machineId": "1",
      "timestamp": 1371152474,
      "errorNumber":"12",
      "posSliderIn":"1",
      "posInnerSliderOut":"10",
      "posOuterSliderOut":"4",
      "posStorageWheel":"5",
      "controllerError":"123",
      "errorLag":"1",
      "errorWindow":"12",
      "inputStatus":"8"
    }

    WsAPI.insertErrorLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
    done()
  })


  it('should return -1 in case of empty error log object', function (done) {
    var record = {}

    WsAPI.insertErrorLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })


  it('should return -1 in case of invalid, empty properties, error log', function (done) {
    var record = { 'machineId': 1 }

    WsAPI.insertErrorLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })

})


describe('#insertTemperatureLogRecord()', function () {
  it('should insert correctly error log record', function (done) {
    var record = {
      "machineId": "1",
      "timestamp": 1370711389,
      "applicationTemperature": 300,
      "condensorTemperature": 400,
      "defrostTemperature": 100
    }

    WsAPI.insertTemperatureLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')
      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
    done()
  })

  it('should return -1 in case of empty temperature log object', function (done) {
    var record = {}

    WsAPI.insertTemperatureLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })


  it('should return -3 in case of invalid, empty properties, temperature log', function (done) {
    var record = { 'machineId': 1 }

    WsAPI.insertTemperatureLogRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
 })
})

describe('#insertStatusRecord()', function () {

  it ('should insert correctly temperature log record', function (done ) {

    var record = {
      "machineId": "1",
      "mainStatus": "20",
      "inputBottleStatus": "0",
      "outputBottleStatus": "0",
      "error": "2",
      "mode": "0",
      "totalDispensed": "0"
    }

    WsAPI.insertStatusRecord(record,  function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
    done()
  })

  it('should return -2 in case of invalid, empty properties, status log', function (done) {
    var record = { "machineId" : "1"}

    WsAPI.insertStatusRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })
})

describe('#insertStorageWheelRecord()', function () {

it ('should insert correctly from real machine', function (done) {
  var record = {
    "machineId":"1",
    "position":"1",
    "timestamp":"1367072848",
    "status":"2",
    "productTableIndex":"1"
  }
    WsAPI.insertStorageWheelRecord(record,function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
    done()
})


  it ('should insert correctly status record', function (done) {

    var record = {
      "machineId": 1,
      "position": 2,
      "status": 3,
      "timestamp": 1371152474,
      "productTableIndex": 4
    }

    WsAPI.insertStorageWheelRecord(record,function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
    done()
  })

  it('should return -1 in case of invalid, empty properties, storage log', function (done) {
    var record = { 'machineId': 1}

    WsAPI.insertStorageWheelRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })
})

describe('#insertProductTableRecord()', function () {

  it ('should insert correctly table product record', function (done) {

    var record = {
      "machineId": "1",
      "index": "2",
      "barcode": "030040056788"
    }

    WsAPI.insertProductTableRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
    done()
  })

  it('should return -1 in case of invalid, empty properties, product table log', function (done) {
    var record = { 'machineId': "1"}

    WsAPI.insertProductTableRecord(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })
})


describe('#insertParameterValue()', function () {

  it ('should insert correctly parameter value record', function (done ) {

    var record = {
      "machineId": "1",
      "parameterNumber": "02",
      "parameterValue": "40"
    }

    WsAPI.insertParameterValue(record, function (err, result) {
     result.should.be.a('object')
     result.should.have.property('return')
     result.return.should.be.a('string')

     var r = JSON.parse(result.return)
     r.should.have.property('result', 1)
    })
    done()
  })

  it ('should return -1 in case of invalid, empty properties, parameter value', function (done) {
    var record = { "machineId": "1" }

    WsAPI.insertParameterValue(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })

  it ('should return -1 in case of invalid, empty properties, parameter value', function (done) {
    var record = { }

    WsAPI.insertParameterValue(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })
})

describe('#insertCommand()', function () {
  it ('should not insert a empty command into database for testing purposes', function (done) {
    var record = { }

    WsAPI.insertCommand(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -2)
    })
    done()
  })
})
/*
describe('#getCommandFromMachine()', function () {

  before(function(done){
    var record = { 'machineId': 1, 'commandId': '23', 'commandParameters': '20,345234765'}
    WsAPI.insertCommand(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
    done()
  })

  it ('should retrieve a command from machine with id 1', function (done) {
    var record = {'machineId': 1}

    WsAPI.getCommandFromMachine(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result')
      if (r.result == -3) {
        r.should.have.property('result', -3)
      } else {
        r.result.should.have.keys('seqId', 'commandId', 'commandParameters')
        r.result.should.include({ 'commandId': '23', 'commandParameters': '20,345234765'})
      }

     var removeRecord = { 'machineId': 1, 'seqId': r.result.seqId}
     WsAPI.removeCommandFromMachine(removeRecord, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)
    })
   })
  done()
  })

  it ('should retrieve a command from invalid machine with id 0', function (done) {
    var record = {'machineId': 0}

    WsAPI.getCommandFromMachine(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', -3)
    })
    done()
  })
 }) */

describe('#resultFirmware', function () {
  it ('should insert the status of firmware', function (done) {

    var record = { "machineId": 1, "path": '/tmp/0b854c7a7c528adefda00bd31e2aca0c.hex', "status": 1}
    WsAPI.resultFirmware(record, function (err, result) {
      result.should.be.a('object')
      console.log(JSON.stringify(result))
    })
    done()
  })
})


describe('#resultSequence', function () {
  it ('should mark successfully the end of standard sequence', function (done) {
    var record = { "machineId" : 1, "status": "1" }
    WsAPI.resultSequence(record, function (err, result) {
      console.log(JSON.stringify(result))
    })
    done()
  })
})

/*
describe('#removeCommandFromMachine()', function () {

  it ('should remove a command from machine with id 1', function (done) {
    var record = { "machineId": 1, "seqId": 1 }

    WsAPI.removeCommandFromMachine(record, function (err, result) {
      result.should.be.a('object')
      result.should.have.property('return')
      result.return.should.be.a('string')

      var r = JSON.parse(result.return)
      r.should.have.property('result', 1)

    })
    done()
  })
 }) */
})
