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
        }).to.throw(/Invalid value: null for type: string/);
    });

    it('Invalid number should throw', () => {
        expect(() => {
            props.validate(raw.invalidNumber, {
                myNumber: 'number'
            });
        }).to.throw(/Invalid value: puppy for type: number/);
    });

    it('Invalid array should throw', () => {
        expect(() => {
            props.validate(raw.invalidArray, {
                myArray: 'array'
            });
        }).to.throw(/Invalid value: \[object Object\] for type: array/);
    });

    it('Invalid typed array should throw', () => {
        expect(() => {
            props.validate(raw.invalidTypedArray, {
                myTypedArray: '[number]'
            });
        }).to.throw(/Invalid value: Fri Nov 11 1955 16:00:00 GMT-0800 \(PST\) for type: number/);
    });

    it('Invalid object should throw', () => {
        expect(() => {
            props.validate(raw.invalidObject, {
                myObject: 'object'
            });
        }).to.throw(/Invalid value: Flutter Shy for type: object/);
    });

    it('Invalid date should throw', () => {
        expect(() => {
            props.validate(raw.invalidDate, {
                myDate: 'date'
            });
        }).to.throw(/Invalid value: 13\/13\/13 for type: date/);
    });

    it('Invalid boolean should throw', () => {
        expect(() => {
            props.validate(raw.invalidTrue, {
                myTrue: 'boolean'
            });
        }).to.throw(/Invalid value: foo for type: boolean/);
    });

    it('Invalid boolean should throw', () => {
        expect(() => {
            props.validate(raw.invalidFalse, {
                myFalse: 'boolean'
            });
        }).to.throw(/Invalid value: -1 for type: boolean/);
    });

    it('Invalid custom should throw', () => {
        expect(() => {
            props.validate(raw.invalidCustom, {
                myCustom: value => /twilight/i.test(value),
            });
        }).to.throw(/Invalid value: Bulbasaur for type: value => \/twilight\/i.test\(value\)/);
    });

    it('Invalid regex should throw', () => {
        expect(() => {
            props.validate(raw.invalidRegExp, {
                myRegExp: /^Rarity\s\w+\sgems/,
            });
        }).to.throw(/Invalid value: Pikachu for type: \/\^Rarity\\s\\w\+\\sgems\//);
    });
});
