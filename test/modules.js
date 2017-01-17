"use strict";

var jsdom = require('mocha-jsdom');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var Croppr = require('../dist/croppr.js');

// Create fake DOM
jsdom({
    html: fs.readFileSync('test/mock.html', 'utf-8'),
    globalize: true
});

describe('Croppr constructor', function() {
    it('should be a function', function() {
      assert.equal(typeof Croppr, 'function');
    });
});

describe('Croppr', function() {
    beforeEach('setup fake dom', function() {
        document.body.innerHTML = '<img src="mock.jpg" alt="" id="croppr">'
    });

    describe('Croppr instantiation', function() {
        it('should work by passing a query selector', function() {
            assert.doesNotThrow(function() {
                new Croppr('#croppr', {});
            });
        });

        it('should work by passing an Element object', function() {
            let el = document.getElementById('croppr');
            assert.doesNotThrow(function() {
                new Croppr(el, {});
            });
        });

        it('should throw exception when element is not found', function() {
            assert.throws(function() { new Croppr('#404', {}); });
        });

        it('should throw exception when element is not an img', function() {
            document.body.innerHTML = '<div id="croppr"></div>';
            assert.throws(function() { new Croppr('#croppr'); });
        });

        it('should throw exception when img has no src', function() {
            document.body.innerHTML = '<img id="croppr">';
            assert.throws(function() { new Croppr('#croppr'); });
        });

        it('should work without specifying any options', function() {
            assert.doesNotThrow(function() { new Croppr('#croppr'); });
        });
    });

});