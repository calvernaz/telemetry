'use strict'

var assert = require('assert'),
  FirmwareReader = require('../utils/FirmwareReader'),
  should = require('should')


describe('FirmwareReader', function () {

  var config = {
    path: process.env.PWD + '/scripts/firmware/GlacierCTRL.hex',
    debug: false
  }
  
  describe('#read()', function () {
    it('should detect EOF string', function (done) {
      var FwRd = new FirmwareReader(config)
      FwRd.readFile(function (ln) {
        ln.should.be.a('string')
        ln.should.include(':')
      })
      done()  
    })
  })
})

