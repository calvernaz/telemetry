'use strict'

var assert = require('assert'),
ParserModule = require('../Parser.js'),
should = require('should')

describe('Parser', function () {
  /*
  describe('#write()', function () {

    var Parser = new ParserModule ({ onMessage : function () {} })
    it ('should call onMessage callback correctly, with simple message', function (done) {
      Parser.write(':20 13,10,303030,443,454 \n')
      done()
    })

    it ('should call onMessage callback correctly, with two message in same stream', function (done) {
      Parser.write(':07 12,0,10,34,6,8 \n:04 \n')
      done() 
    })
  })
*/

  describe('#parseDelimiters()', function () {
    it ('should parse delimiters correctly, for simple message', function (done) {
      var Parser = new ParserModule ({ onMessage : function () {}, debug: false })
      Parser.write(':01 \n')

      Parser.parseDelimiters()
      var processMessage = Parser.getProcessedMessage()
      processMessage.should.be.a('string')
      processMessage.should.eql('01 ')
      done()
    })
 
    it ('should parse delimiters correctly, for complex message', function (done) {
      var Parser = new ParserModule ({ onMessage : function () {}, debug: false })
      Parser.write(':04 34,454,45454 \n')

      Parser.parseDelimiters()
      var processMessage = Parser.getProcessedMessage()

      processMessage.should.be.a('string')
      processMessage.should.eql('04 34,454,45454 ')
      done()
    })

    it ('should parse delimiters correctly, two messages in same stream, takes the last', function (done) {
      var Parser = new ParserModule ({ onMessage : function () {}, debug: false })
      Parser.write(':20 34,454,45454\n:04 \n')

      Parser.parseDelimiters()
      var processMessage = Parser.getProcessedMessage()
      processMessage.should.be.a('string')
      processMessage.should.eql('04 ')
      done()
    })

    it ('should parse delimiters correctly, one message with all ASCII valid values', function (done) {
      var Parser = new ParserModule ({ onMessage : function () {}, debug: false })
      Parser.write(':15 3434343,2,3,4,-,.,.- \n')

      Parser.parseDelimiters()
      var processMessage = Parser.getProcessedMessage()

      processMessage.should.be.a('string')
      processMessage.should.eql('15 3434343,2,3,4,-,.,.- ')
      done()
    })
  })
})