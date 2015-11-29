'use strict';

const should = require('chai').should,
    props = require('../'),
    raw = require('./raw');

should();

describe('Create schema validator', () => {
    let schemaValidator,
        valid;

    before('Schema validator should validate objects', () => {
        schemaValidator = props.createSchemaValidator({
            myString: 'string',
            myNumber: 'number',
            myArray: 'array',
            myTypedArray: '[number]',
            myObject: 'object',
            myDate: 'date',
            myTrue: 'boolean',
            myFalse: 'boolean',
            myCustom: value => /twilight/i.test(value),
        });

        valid = schemaValidator(raw.all);
    });

    it('valid.myString should be a string', () => valid.myString.should.be.a.string);

    it('valid.myNumber should be a number', () => valid.myNumber.should.be.a.number);

    it('valid.myArray should be an array', () => valid.myArray.should.be.an.array);

    it('valid.myTypedArray should be an array of numbers', () => valid.myTypedArray.should.have.members([24, 13, 30, 1337]));

    it('valid.myObject should be an object', () => valid.myObject.should.be.an.object);

    it('valid.myDate should be a date', () => valid.myDate.should.be.an.instanceof(Date));

    it('valid.myTrue should be true', () => valid.myTrue.should.be.true);

    it('valid.myFalse should be false', () => valid.myFalse.should.be.false);

});
