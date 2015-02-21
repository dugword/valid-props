'use strict';

var assert = require('assert'),
    props = require('../'),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Confirm invalid object', function() {

    var invalidString = props.validate(raw.invalidString, {
        myString: 'string'
    });

    var invalidNumber = props.validate(raw.invalidNumber, {
        myNumber: 'number'
    });

    var invalidArray = props.validate(raw.invalidArray, {
        myArray: 'array'
    });

    var invalidTypedArray = props.validate(raw.invalidTypedArray, {
        myTypedArray: '[number]'
    });

    var invalidObject = props.validate(raw.invalidObject, {
        myObject: 'object'
    });

    var invalidDate = props.validate(raw.invalidDate, {
        myDate: 'date'
    });

    var invalidTrue = props.validate(raw.invalidTrue, {
        myTrue: 'boolean'
    });

    var invalidFalse = props.validate(raw.invalidFalse, {
        myFalse: 'boolean'
    });

    it('invalidString should be null', function () {
        expect(invalidString).to.be.null();
    });

    it('invalidNumber should be null', function () {
        expect(invalidNumber).to.be.null();
    });

    it('invalidArray should be null', function () {
        expect(invalidArray).to.be.null();
    });

    it('invalidTypedArray should be null', function () {
        expect(invalidTypedArray).to.be.null();
    });

    it('invalidObject should be null', function () {
        expect(invalidObject).to.be.null();
    });

    it('invalidDate should be null', function() {
        expect(invalidDate).to.be.null();
    });

    it('invalidTrue should be null', function () {
        expect(invalidTrue).to.be.null();
    });

    it('invalidFalse should be null', function () {
        expect(invalidFalse).to.be.null();
    });
});
