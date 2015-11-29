'use strict';

/* jshint -W030 */

const props = require('../'),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Confirm invalid object', function() {

    it('Invalid string should throw', () => {
        expect(() => {
            props.validate(raw.invalidString, {
                myString: 'string'
            });
        }).to.throw(/Invalid value for: string/);
    });

    it('Invalid number should throw', () => {
        expect(() => {
            props.validate(raw.invalidNumber, {
                myNumber: 'number'
            });
        }).to.throw(/Invalid value for: number/);
    });

    it('Invalid array should throw', () => {
        expect(() => {
            props.validate(raw.invalidArray, {
                myArray: 'array'
            });
        }).to.throw(/Invalid value for: array/);
    });

    it('Invalid typed array should throw', () => {
        expect(() => {
            props.validate(raw.invalidTypedArray, {
                myTypedArray: '[number]'
            });
        }).to.throw(/Invalid value for: [number]/);
    });

    it('Invalid object should throw', () => {
        expect(() => {
            props.validate(raw.invalidObject, {
                myObject: 'object'
            });
        }).to.throw(/Invalid value for: object/);
    });

    it('Invalid date should throw', () => {
        expect(() => {
            props.validate(raw.invalidDate, {
                myDate: 'date'
            });
        }).to.throw(/Invalid value for: date/);
    });

    it('Invalid boolean should throw', () => {
        expect(() => {
            props.validate(raw.invalidTrue, {
                myTrue: 'boolean'
            });
        }).to.throw(/Invalid value for: boolean/);
    });

    it('Invalid boolean should throw', () => {
        expect(() => {
            props.validate(raw.invalidFalse, {
                myFalse: 'boolean'
            });
        }).to.throw(/Invalid value for: boolean/);
    });
});
