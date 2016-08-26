![valid-props logo](/images/logo.png) valid-props
===========

The ultra lightweight, dependency free, flexible, extensible, object property
validator with a simple succinct interface that runs in any ES5 compatible
environment.

## VERSION
2.0.0

## CHANGES
In addition to new features, version 2.0.0 changes the default API to reject
empty arrays and objects. Previously this required setting "apiVersion" to
greater than 1.5.

Valid Props also throws errors by default when objects with invalid schemas
are validated. The version 1.x behaviour can be restored by setting the
errorType to 'returnNull'.

## SYNOPSIS
Verifies a JavaScript object contains valid pre-defined properties of a given
type. Useful for web services, API end points, and other sources of user input
to confirm that objects contain the expected information.

## METHODS
The valid-props module contains these methods:

    attach(object)
    create(opitons)
    registerType(name, function)
    registerSchema(name, schema [,optionalSchema])
    use(plugin)
    validate(object, schema [,optionalSchema])
    createSchemaValidator(schema [,optionalSchema])

The `create` method returns a new instance of the valid-props object with
the behaviour defined by the `options` object.

The `validate` method accepts an object as the first parameter and compares it
to the schema object in the second parameter.

All the properties declared in the schema are required. If the object being
checked is missing a property or the property is of a different type an error
will be thrown. If the errorType is set to "returnNull" the value "null" will be
returned instead.

If the object contains all the properties of the correct type then a new object
is returned with those properties. Any additional undeclared properties from
the original object are not returned.

If an optional schema is given, the method will do nothing if the optional
property is not included in the object. If the property is present and of the
correct type it will be returned with the resultant object. If the optional
property is of the incorrect type an error will be thrown or the entire return
value will be null (depending on the current setting of "errorType")

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

The `registerType` method allows you to create new types that you can declare
in your schema. The method's first argument is a string which is the name of
the new type, the second argument is a function that takes one argument `value`
which is the value to be checked. If the function returns a truth value is
accepted and returned, otherwise the value is rejected and an error is thrown.

The function passed to registerType will be called in a try block, and if an
error is thrown the value will also be rejected.

The `registerSchema` method allows you to create a new schema that can be called
by name in subsequent calls.

The `use` method accepts an object with a series of properties with function
values. The names of these properties become types that can be checked against,
using the function value attached to them. Many other string validators on NPM
will just work when passed into this method.

The 'createSchemaValidator` accepts a schema object and optional schema object,
and returns a function that will validate objects against that schema.

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
            nestedObject: {
                rank: 'string',
                level: 'number',
            },
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

    // Example 5: Create a new validator function for specific schemas
    var schemaValidator = require('valid-props').createSchemaValidator({
    	myString: 'string'
    });

    try {
        var valid = schemaValidator({ myString: 'This is a string' });
    }
    catch (e) {
        console.error(e.message); // Valid object, won't throw
    }


# TYPES
- string
  - All types will be coerced to a string by calling their `toString()` method
- number
  - Coerces strings that look like numbers
- int
  - Coerces strings that look like numbers
  - Floors decimal values to integers
- array
- function
- object
- boolean
  - Coerces strings that look like boolean values
- typed array (Supports any other type)
  - Will coerce the type specified
- Date (JavaScript Date object)
  - Coerces strings that look like dates

# ES2015
This module is written in es2015, but uses bable to transpile the code down to
es5 compatable JavaScript. You can load the es2015 source directly:
    const props = require('valid-props/src');

This may result in performance improvements is you are running the module in a
es2015 compatible environment.

# BUGS AND LIMITATIONS
Please let me know
