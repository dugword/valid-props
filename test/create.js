'use strict';

var assert = require('assert'),
    props = require('../'),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Confirm valid object', function () {
    var validator = props.create({
        errorType: 'throw',
    });

    var valid = props.validate({}, {
        myString: 'string',
        myNumber: 'number',
        myArray: 'array',
        myTypedArray: '[number]',
        myObject: 'object',
        myDate: 'date',
        myTrue: 'boolean',
        myFalse: 'boolean'
    });

    it('valid should not be null', function () {
        expect(valid).to.be.null();
    });

    var errorMessage = '';
    try {
        var invalid = validator.validate({}, {
            myString: 'string',
            myNumber: 'number',
            myArray: 'array',
            myTypedArray: '[number]',
            myObject: 'object',
            myDate: 'date',
            myTrue: 'boolean',
            myFalse: 'boolean'
        });
    }
    catch (e) {
        errorMessage = e.message;
    }

    it('invalid error message should be invalid', function () {
        expect(errorMessage).to.equal('Missing properties: myString, myNumber, myArray, myTypedArray, myObject, myDate, myTrue, myFalse');
    });


});
