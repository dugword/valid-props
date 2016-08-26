'use strict';

/* jshint -W030 */

const props = require('../'),
    should = require('chai').should,
    raw = require('./raw');

should();

describe('Confirm valid object', function() {

    let valid;

    before('Validate object', () => {
        valid = props.validate(raw.all, {
            myString: 'string',
            myNumber: 'number',
            myArray: 'array',
            myTypedArray: '[number]',
            myObject: 'object',
            myDate: 'date',
            myTrue: 'boolean',
            myFalse: 'boolean',
            myCustom: value => /twilight/i.test(value),
            myRegExp: /^Rarity\s\w+\sgems/,
            myNestedObject: {
                myNestedString: 'string',
                myNestedNumber: 'number',
                myDoubleNestedObject: {
                    myDoubleNestedString: 'string',
                    myDoubleNestedNumber: 'number',
                },
            },
        });
    });

    it('valid.myString should be a string', () => valid.myString.should.be.a.string);

    it('valid.myNumber should be a number', () => valid.myNumber.should.be.a.number);

    it('valid.myArray should be an array', () => valid.myArray.should.be.an.array);

    it('valid.myTypedArray should be an array of numbers', () => valid.myTypedArray.should.have.members([24, 13, 30, 1337]));

    it('valid.myObject should be an object', () => valid.myObject.should.be.an.object);

    it('valid.myDate should be a date', () => valid.myDate.should.be.an.instanceof(Date));

    it('valid.myTrue should be true', () => valid.myTrue.should.be.true);

    it('valid.myFalse should be false', () => valid.myFalse.should.be.false);

    it('valid.myCustom should be valid', () => valid.myCustom.should.be.a.string);

    it('valid.myRegExp should be a string', () => valid.myRegExp.should.be.a.string);
    it('valid.myNestedObject should have keys', () => valid.myNestedObject.should.have.keys(['myNestedString', 'myNestedNumber', 'myDoubleNestedObject']));

});
