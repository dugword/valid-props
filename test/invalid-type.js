'use strict';

var assert = require('assert'),
    props = require('../').create({errorType: 'returnNull'}),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Invalid types should throw error', function () {

    it('Invalid type should throw', function () {
        try {
            var valid = props.validate(raw.all, {
                myString: 'invalid-type',
            });
        }
        catch (err) {
            expect(err.message).to.equal('Invalid type in schema: invalid-type');
        }
    });

    it('Invalid double api optional should throw error', function () {
        try {
            var validTwo = props.validate(raw.all, {
                myString: 'string',
            }, {
                myNumber: 'number?'
            });
        }
        catch (err) {
            expect(err.message).to.equal('Invalid type in schema: number?');
        }
    });

});
