'use strict';

/* jshint -W030 */

const props = require('../').create({
        errorType: 'returnNull'
    }),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Confirm invalid object', function () {

    const invalidString = props.validate(raw.invalidString, {
        myString: 'string'
    });

    const invalidNumber = props.validate(raw.invalidNumber, {
        myNumber: 'number'
    });

    const invalidArray = props.validate(raw.invalidArray, {
        myArray: 'array'
    });

    const invalidTypedArray = props.validate(raw.invalidTypedArray, {
        myTypedArray: '[number]'
    });

    const invalidObject = props.validate(raw.invalidObject, {
        myObject: 'object'
    });

    const invalidDate = props.validate(raw.invalidDate, {
        myDate: 'date'
    });

    const invalidTrue = props.validate(raw.invalidTrue, {
        myTrue: 'boolean'
    });

    const invalidFalse = props.validate(raw.invalidFalse, {
        myFalse: 'boolean'
    });

    it('invalidString should be null', function () {
        expect(invalidString).to.be.null;
    });

    it('invalidNumber should be null', function () {
        expect(invalidNumber).to.be.null;
    });

    it('invalidArray should be null', function () {
        expect(invalidArray).to.be.null;
    });

    it('invalidTypedArray should be null', function () {
        expect(invalidTypedArray).to.be.null;
    });

    it('invalidObject should be null', function () {
        expect(invalidObject).to.be.null;
    });

    it('invalidDate should be null', function () {
        expect(invalidDate).to.be.null;
    });

    it('invalidTrue should be null', function () {
        expect(invalidTrue).to.be.null;
    });

    it('invalidFalse should be null', function () {
        expect(invalidFalse).to.be.null;
    });
});
