'use strict';

var assert = require('assert'),
    props = require('../'),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Confirm optional object', function () {

    var valid = props.validate(raw.all, {}, {
        myString: 'string',
        myNumber: 'number',
        myArray: 'array',
        myTypedArray: '[number]',
        myObject: 'object',
        myDate: 'date',
        myTrue: 'boolean',
        myFalse: 'boolean'
    });

    var validOptional = props.validate(raw.all, {
        myString: 'string',
        myNumber: 'number',
        myArray: 'array',
        myTypedArray: '[number]',
        myObject: 'object',
        myDate: 'date',
        myTrue: 'boolean',
        myFalse: 'boolean'
    },{
        foo: 'string',
        bar: 'number',
        baz: 'array',
        qux: '[number]',
        quux: 'object',
        corge: 'date',
        grault: 'boolean'
    });

    it('valid should not be undefined', function () {
        expect(valid).to.not.be.null();
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

    it('valid.myTypedArray should be an array of numbers', function () {
        expect(valid.myTypedArray).to.have.members([24, 13, 30, 1337]);
    });

    it('valid.myObject should be an object', function () {
        expect(valid.myObject).to.be.an('object');
    });

    it('valid.myDate should be a date', function () {
        expect(valid.myDate).to.be.an.instanceof(Date);
    });

    it('valid myTrue should be true', function () {
        expect(valid.myTrue).to.be.true();
    });

    it('valid myFalse should be false', function () {
        expect(valid.myFalse).to.be.false();
    });

    it('validOptional should not be null', function () {
        expect(validOptional).to.not.be.null();
    });
});
