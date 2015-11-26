![valid-props logo](/images/logo.png) valid-props
===========

## VERSION
1.6.2

## SYNOPSIS
Verifies a JavaScript object contains valid pre-defined properties of a given
type. Useful for web services and other sources of user input to confirm that
objects contain the expected information.

## METHODS
The valid-props module contains these methods:

    attach(object)
    create(opitons)
    validate(object, schema [,optionalSchema])

The `create` method returns a new instance of the valid-props object with
the behaviour defined by the `options` object.

The `validate` method accepts an object as the first parameter and compares it
to the schema object in the second parameter.

All the properties declared in the schema are required. If the object being
checked is missing a property or the property is of a different type the value
"null" will be returned.

If the object contains all the properties of the correct type then a new object
is returned with those properties. Any additional undeclared properties from
the original object are not returned.

If an optional schema is given, the method will do nothing if the optional
property is not included in the object. If the property is present and of the
correct type it will be returned with the resultant object. If the optional
property is of the incorrect type the entire return value will be null.

NOTE: The validate method will do type coercion beyond what JavaScript does and
returns the specified type in the result object. E.g the string `"False"` will
return the boolean value `false` if a boolean is expected.

You can also attach the validate method to an object:
`attach(object)`

This will attach a hidden function `validate` to the object which functions
like the `validate` method, except that the method validates the object it is
attached and only accepts schema and opitonalschema arguments.

`object.validate(schema [,optionalSchema])`

Accessing any properties on the object with throw an error until the validate
function is called. In frameworks like Express this can be set in a middleware
function forcing all routes to validate request parameters.

## EXAMPLE

    // Example 1: Static method call
    var props = require('valid-props');

    function someRoute(req, res) {

        var params = props.validate(req.body, {
            username: 'string',
            password: 'string',
            age: 'number',
            birthday: 'date',  // Casts valid dates to a new Date() object
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

    // Example 2: Attached method call
    var props = require('valid-props');

    function crashAppRoute(req, res) {
        props.attach(req.body);

        if (req.body.username === 'admin') { // THROWS ERROR
            return res.render('admin.jade');
        }

        res.send('user.jade');
    }

    function workingAppRoute(req, res) {
        props.attach(req.body);

        var params = req.body.validate({     // Clears flag preventing access
            username: 'string',
        });

        if (params.username === 'admin') {
            return res.render('admin.jade');
        }

        res.send('user.jade');
    }

    // Example 3: Create a new isolated instance with a different error type
    var props = require('valid-props'),
        validator = props.create({ errorType: 'throw' });

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
    }
    catch (e) {
        console.error(e.message); // 'Missing properties: foo'
    }

    // Example 4: Create a new isolated instance with updated behaviour
    var validator = require('valid-props').create({
        errorType: 'throw',
        apiVersion: 1.5     // API Version 1.5 rejects empty arrays and objects
    });

    try {
        var invalid = validator.validate({bar: []}, {
            foo: 'array'
        });
    }
    catch (e) {
        console.error(e.message); // 'Invalid type: array'
    }

# TYPES
- string
  - All types will be coerced to a string by calling their `toString()` method
- number
  - Coerces strings that look like numbers
- array
- object
- boolean
  - Coerces strings that look like boolean values
- typed array (Supports any other type)
  - Will coerce the type specified
- Date (JavaScript Date object)
  - Coerces strings that look like dates

# BUGS AND LIMITATIONS
Please let me know

# TODO
Future versions of this module will have behavior switches to enable more
control over how invalid objects are handled (throw an error, vs return null),
and how optional parameters are handled (if the optional property is the wrong
type, strip it and return the required properties). There will also be a strict
mode that does not do type coercion.
