'use strict';

var props = require('valid-props'),
    validator = props.create({
        errorType: 'throw'
    });

var invalidParamsNull = props.validate({bar: 'bar'}, {
    foo: 'string',
});

if (invalidParamsNull === null) {
    console.log('This value is ', invalidParamsNull); // 'This value is null'
}

try {

    var invalidParamsThrow = validator.validate({bar: 'bar'}, {
        foo: 'string',
    });

} catch (e) {

    console.error(e.message); // 'Missing properties: foo'

}

