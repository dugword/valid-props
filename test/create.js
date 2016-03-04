'use strict';

/* jshint -W030 */

const props = require('../'),
    expect = require('chai').expect;

describe('Confirm valid object', function() {

    it('errorType "returnNull" should not throw', () => {
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

    it('errorType "throw" should throw', () => {
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

    it('errorType "throw" should throw when invalid', () => {
        const throwValidator = props.create({
            errorType: 'throw',
        });

        expect(() => {
            throwValidator.validate({
                myString: 'string',
                myNumber: 'Pinkie Pie',
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
        }).to.throw(/Invalid value: Pinkie Pie for type: number/);
    });

    it('errorType "returnNull" should return null', () => {
        const nullValidator = props.create({
            errorType: 'returnNull',
        });

        const params = nullValidator.validate({
            myString: 'string',
            myNumber: '42',
            myArray: ['array'],
            myTypedArray: [1, 42, 3],
            myObject: {
                foo: 'bar'
            },
            myDate: new Date(),
            myTrue: 'Apple Jack',
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

        expect(params).to.be.null;
    });

});
