'use strict';

var assert = require('assert'),
    props = require('../'),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Confirm valid object', function () {
    var validator = props.create({
        errorType: 'throw',
    });

    it('valid should not be null', function () {

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
        expect(valid).to.be.null();
    });

    it('invalid error message should be invalid', function () {
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
        expect(errorMessage).to.equal('Missing properties: myString, myNumber, myArray, myTypedArray, myObject, myDate, myTrue, myFalse');
    });

    it('valid obj should be valid when error type is throw', function () {

        var validThrow;
        try {
            validThrow = validator.validate({
                myString: 'string',
                myNumber: '42',
                myArray: ['array'],
                myTypedArray: [1, 2, 3],
                myObject: {
                    foo: 'bar'
                },
                myDate: new Date(),
                myTrue: true,
                myFalse: false,
            }, {
                myString: 'string',
                myNumber: 'number?',
                myArray: 'array',
                myTypedArray: '[number]',
                myObject: 'object',
                myDate: 'date',
                myTrue: 'boolean',
                myFalse: 'boolean?'
            });
        }
        catch (err) {
        }

        expect(validThrow).to.not.be.null();
        expect(validThrow).to.not.be.undefined();
    });


});
