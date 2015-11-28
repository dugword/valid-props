'use strict';

/* jshint -W030 */

const props = require('../'),
    should = require('chai').should,
    expect = require('chai').expect;
should();

describe('Confirm valid object', function () {

    it('invalid should not throw', () => {
        const nullValidator = props.create({
            errorType: 'returnNull',
        });

        let params;
        expect(params = nullValidator.validate({}, {
            myString: 'string',
            myNumber: 'number',
            myArray: 'array',
            myTypedArray: '[number]',
            myObject: 'object',
            myDate: 'date',
            myTrue: 'boolean',
            myFalse: 'boolean'
        })).to.not.throw;

        expect(params).to.be.null;
    });

    it('invalid error message should be invalid', () => {
        const throwValidator = props.create({
            errorType: 'throw',
        });

        expect(() => {
            throwValidator.validate({}, {
                myString: 'string',
                myNumber: 'number',
                myArray: 'array',
                myTypedArray: '[number]',
                myObject: 'object',
                myDate: 'date',
                myTrue: 'boolean',
                myFalse: 'boolean'
            });
        }).to.throw(/Missing properties/);
    });

    it('valid obj should be valid when error type is throw', () => {

        let validThrow;
        try {
            validThrow = props.validate({
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
            console.error('err', err);
            console.error('validThrow', validThrow);
        }

        expect(validThrow).to.not.be.null;
        expect(validThrow).to.not.be.undefined;
    });

});
