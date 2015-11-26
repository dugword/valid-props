'use strict';

const expect = require('chai').expect;



describe('Test all the examples in the README.md file', () => {
    describe('Example 1: Static method call', () => {
        var props = require('../');

        function someRoute(req, res) {

            var params = props.validate(req.body, {
                username: 'string',
                password: 'string',
                age: 'number',
                birthday: 'date', // Casts valid dates to a new Date() object
                stats: '[string]', // An array of strings
                foo: 'array',
                bar: 'object',
                blerg: 'string?', // Trailing '?' for optional properties
            }, {
                baz: 'boolean' // Or pass a second optional schema,
            });

            if (params === null) {
                return res.send('Error: Invalid request parameters');
            }

            res.send('Success: A valid request was sent');
        }
    });

    describe('Example 2: Attached method call', () => {
        var props = require('../');

        function crashAppRoute(req, res) {
            props.attach(req.body);

            if (req.body.username === 'admin') { // THROWS ERROR
                return res.render('admin.jade');
            }

            res.send('user.jade');
        }

        function workingAppRoute(req, res) {
            props.attach(req.body);

            var params = req.body.validate({ // Clears flag preventing access
                username: 'string',
            });

            if (params.username === 'admin') {
                return res.render('admin.jade');
            }

            res.send('user.jade');
        }
    });

    describe('Example 3: Create a new isolated instance with a different error type', () => {
        var props = require('../'),
            validator = props.create({
                errorType: 'throw'
            });

        var invalidParamsNull = props.validate({
            bar: 'bar'
        }, {
            foo: 'string',
        });

        if (invalidParamsNull === null) {
            console.log('This value is ', invalidParamsNull); // 'This value is null'
        }

        try {
            var invalidParamsThrow = validator.validate({
                bar: 'bar'
            }, {
                foo: 'string',
            });
        } catch (e) {
            console.error(e.message); // 'Missing properties: foo'
        }
    });

    describe('Example 4: Create a new isolated instance with updated behaviour', () => {
        var validator = require('../').create({
            errorType: 'throw',
            apiVersion: 1.5 // API Version 1.5 rejects empty arrays and objects
        });

        try {
            var invalid = validator.validate({
                bar: []
            }, {
                foo: 'array'
            });
        } catch (e) {
            console.error(e.message); // 'Invalid type: array'
        }
    });

});
