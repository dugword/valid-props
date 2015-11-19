valid-props
===========

## VERSION
1.5.1

## SYNOPSIS
Verifies if a JavaScript Object contains valid pre-defined properties.
Useful for web services and other sources of user input to confirm that
requests contain the expected information.

## METHODS
The valid-props module contains the method:
`validate(object, schema [,optionalSchema])`

It accepts an object as the first parameter and compares it to the schema
object in the second parameter.

All the properties declared in the schema are required, and if the object being
checking is missing a property or the property is of a different type the value
"null" will be returned.

If the object contains all the properties of the correct type then a new object
is returned with those properties. Any additional undeclared properties from
the object are not returned.

If an optional schema is given, the method will behave as normal if the
property is not included in the object. If the property is present and of the
correct type it will be returned with the resultant object. If the optional
property is the incorrect type the entire return value will be null.

NOTE: The validate method will do type coercion beyond what JavaScript does and
returns the specified type in the result object.


You can also attach the validate method to an object:
`attach(object)`

This will attach a hidden function `validate` to the object, and accessing any
properties on the object with throw an error until the validate function is
called. In frameworks like Express this can be set in a middleware function
forcing all routes to validate their input.

## EXAMPLE

    var props = require('valid-props');
    // props.errorType('throw') // Throws an error instead of returning null

    function (req, res) {

        var params = props.validate(req.body, {
            username: 'string',
            password: 'string',
            age: 'number',
            birthday: 'date',
            stats: '[string]', // An array of strings
            foo: 'array',
            bar: 'object'
            blerg: 'string?', // Trailing '?' for optional properties
        }, {
            baz: 'boolean' // Or pass a second optional schema
        });

        if (params === null) {
            return res.send('error')
        }

        res.send('success')
    }

    function (req, res) {
        props.attach(req.body);

        if (req.body.username === 'admin') // THROWS ERROR
            return res.render('admin.jade')

        res.send('user.jade')
    }

    function (req, res) {
        props.attach(req.body);

        var params = req.body.validate({     // Clears flag preventing access
            username: 'string'
        });

        if (params.username === 'admin')
            return res.render('admin.jade')

        res.send('user.jade')
    }

    // Create a new isolated instance with a different error type
    var validator = props.create({ errorType: 'throw' });

    try {
        var invalid = validator.validate({bar: 'bar'}, {
            foo: 'string'
        });
    }
    catch (e) {
        console.error(e.message); // 'Missing properties: foo'
    }

    // Create a new isolated instance with updated behaviour
    var validator = props.create({
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
[X] FIXED: When passing non-declared params but none are invalid an empty object was being returned.
Please let me know

# TODO
Future versions of this module will have behavior switches to enable more
control over how invalid objects are handled (throw an error, vs return null),
and how optional parameters are handled (if the optional property is the wrong
type, strip it and return the required properties). There will also be a strict
mode that does not do type coercion.
