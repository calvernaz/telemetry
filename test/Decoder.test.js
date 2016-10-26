'use strict'


var assert = require('assert'),
  should = require('should'),
  DecoderModule = require('../Decoder.js'),
  ParserModule = require('../Parser.js')



describe('Decoder', function () {

  describe('#decodeMessage()', function () {
    it ('should validate AUTHENTICATION message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':01 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '01')
      done()
    })

    it ('should validate ACKNOWLEDGE message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':04 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '04')
      done()
    })


    it ('should validate NOT_ACKNOWLEDGE message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':05 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '05')
      done()
    })

    it ('should validate STATUS_REQUEST message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':06 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '06')
      done()
    })

    it ('should validate STATUS_REPORT message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':07 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '07')
      done()
    })

    it ('should validate DISPENSE_LOG_REQUEST message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':10 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '10')
      done()
    })

    it ('should validate DISPENSE_LOG_RECORD message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':11 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '11')
      done()
    })

    it ('should validate ERROR_LOG_REQUEST message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':12 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '12')
      done()
    })

    it ('should validate ERROR_LOG_RECORD message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':13 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '13')
      done()
    })

    it ('should validate TEMPERATURE_LOG_REQUEST message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':14 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '14')
      done()
    })

    it ('should validate TEMPERATURE_LOG_RECORD message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':15 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '15')
      done()
    })

    it ('should validate SW_TABLE_REQUEST message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':20 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '20')
      done()
    })

    it ('should validate SW_TABLE_RECORD message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':21 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '21')
      done()
    })

    it ('should validate PRODUCT_TABLE_REQUEST message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':22 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '22')
      done()
    })

    it ('should validate PRODUCT_TABLE_RECORD message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':23 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '23')
      done()
    })

    it ('should validate PARAMETER_VALUE_REQUEST message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':30 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '30')
      done()
    })

    it ('should validate PARAMETER_VALUE message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':31 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '31')
      done()
    })

    it ('should validate PARAMETER_VALUE_CHANGE message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':32 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '32')
      done()
    })

    it ('should validate START_CONTROL_MODE message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':40 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '40')
      done()
    })

    it ('should validate END_CONTROL_MODE message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':41 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '41')
      done()
    })

    it ('should validate REQUEST_TO_UPLOAD_SOFTWARE message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':50 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '50')
      done()
    })

    it ('should validate SOFTWARE_RECORD message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':51 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '51')
      done()
    })

    it ('should validate REBOOT message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':52 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '52')
      done()
    })

    it ('should validate COMMAND message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':60 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '60')
      done()
    })

    it ('should validate END_CONNECTION message', function (done) {
      var Parser = new ParserModule()
      var Decoder = new DecoderModule({ parser: Parser })

      Parser.write(':70 \n')
      var decodedMessage = Decoder.decodeMessage(false)
      decodedMessage.should.be.a('object')
      decodedMessage.should.be.a('object').and.have.property('identifier', '70')
      done()
    })
  })
})
