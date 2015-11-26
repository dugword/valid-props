'use strict';

var assert = require('assert'),
    props = require('../').create({
        apiVersion: 1.5
    }),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Reject empty arrays and objects', function() {
    it('API 1.5 should reject empty arrays', function() {
        let valid = props.validate({
            foo: ['bar']
        }, {
            foo: 'array'
        });

        expect(valid).to.not.be.null();
        expect(valid.foo).to.be.an('array');

        let invalid = props.validate({
            foo: []
        }, {
            foo: 'array'
        });

        expect(invalid).to.be.null();
    });
});
