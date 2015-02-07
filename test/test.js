'use strict';

var assert = require('assert'),
    props = require('../'),
    expect = require('chai').expect;

describe('valid-props', function () {
    var raw = {
        myString: 'Puppy',
        myNumber: 42,
        myArray: ['who', 'what', 'where', 'when', 'why'],
        myTypedArray: [24, 13, 30, 1337],
        myObject: {
            spam: 'eggs'
        },
        myDate: new Date()
    };

    // raw.myNumber = 'puppy';

    var valid = props.validate(raw, {
        myString: 'string',
        myNumber: 'number',
        myArray: 'array',
        myTypedArray: '[number]',
        myObject: 'object',
        myDate: 'date'
    });

    it('valid should not be undefined', function () {
        expect(valid).to.not.be.undefined();
    });

    it('valid.myString should be a string', function () {
        expect(valid.myString).to.be.a('string');
    });

    it('valid.myNumber should be a number', function () {
        expect(valid.myNumber).to.be.a('number');
    });

    it('valid.myArray should be an array', function () {
        expect(valid.myArray).to.be.an('array');
    });

    it('valid.myObject should be an object', function () {
        expect(valid.myObject).to.be.an('object');
    });

    it('valid.myDate should be a date', function () {
        expect(valid.myDate).to.be.an.instanceof(Date);
    });
});
