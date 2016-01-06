'use strict';

const expect = require('chai').expect,
    props = require('../');

describe('Register schema', function () {
    it('Register schema: name, schema, optionalSchema', () => {
        const validator = props.create().registerSchema('user', {
            username: 'string',
            password: 'string',
        }, {
            staySignedIn: 'boolean',
        });

        validator.validate({
            username: 'some-guy',
            password: 'Password1',
            staySignedIn: true,
        }, 'user');

        expect(() => validator.validate({
            username: 'some-guy',
            password: 'Password1',
            staySignedIn: true,
        }, 'user')).to.not.throw();
    });

    it('Register schema: object', () => {
        const validator = props.create().registerSchema({
            name: 'user',
            schema: {
                username: 'string',
                password: 'string',
            },
            optionalSchema: {
                staySignedIn: 'boolean',
            }
        });

        expect(() => validator.validate({
            username: 'some-guy',
            password: 'Password1',
            staySignedIn: true,
        }, 'user')).to.not.throw();
    });

    it('Register schema: array', () => {
        const validator = props.create().registerSchema([{
            name: 'user',
            schema: {
                username: 'string',
                password: 'string',
            },
            optionalSchema: {
                staySignedIn: 'boolean',
            }
        }, {
            name: 'stats',
            schema: {
                lastLogin: 'date',
                lastPost: 'date',
            }
        }]);

        expect(() => validator.validate({
            username: 'some-guy',
            password: 'Password1',
            staySignedIn: true,
        }, 'user')).to.not.throw();

        expect(() => validator.validate({
            lastLogin: new Date(),
            lastPost: '04-20-2015'
        }, 'stats')).to.not.throw();
    });
});
