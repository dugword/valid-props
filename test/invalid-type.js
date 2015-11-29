'use strict';

const props = require('../'),
    expect = require('chai').expect,
    raw = require('./raw');

describe('Invalid types should throw error', function() {

    it('Invalid type should throw', () => {
        expect(() => {
            props.validate(raw.all, {
                myString: 'pony',
            });
        }).to.throw(/Invalid type: pony/);
    });

    it('Invalid double api optional should throw error', () => {
        expect(() => {
            props.validate(raw.all, {
                myString: 'string',
            }, {
                myNumber: 'number?'
            });
        }).to.throw(/Invalid type: number?/);
    });

});
