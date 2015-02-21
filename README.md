valid-props
===========

## VERSION
0.3.0

## SYNOPSIS
NPM module that verifies if a JavaScript Object contains valid pre-defined properties. Useful for REST web services to confirm that JSON POST requests contain the expected information.

## IMPORTANT
This module is still under active development and the API may radically change.

## METHODS
The valid-props module has a method: validate(object, schema, optionalSchema)
It accepts an object as the first parameter and compares it to the schema object in the second parameter.

All the properties declared in the schema are required, and if the object being checking is missing a property or the property is of a different type the value "null" will be returned.

If the object contains all the properties of the correct type then an object is returned with those values. Any additional undeclared properties from the object are stripped.

If an optional schema is given, the method will behave as normal if the property is not included in the object. If the property is present and the correct type it will be returned with the resultant object. If the optional property is the incorrect type the entire result value will be null.

NOTE: The validate method will do type coercion and return the specified type in the result object.

You can also attach the validate(schema, optionalSchema) method to an object with the attach method. Doing this will set a hidden property, and accessing any properties on the object with throw an error until validate is called.

## EXAMPLE

    var props = require('valid-props');

    function (req, res) {

        var params = props.validate(req.body, {
            username: 'string',
            password: 'string',
            age: 'number',
            foo: 'array',
            bar: 'object'
        }, {
            baz: 'boolean'
        });

        if (params === null) {
            return res.send('error')
        }

        res.send('success')
    }

# TYPES
- string
- number
- array
- typed array
- object
- boolean

# BUGS AND LIMITATIONS
Please let me know

# TODO
Future versions of this module will have behavior switches to enable more control over how invalid objects are handled (throw an error, vs return null), and how optional parameters are handled (if the optional property is the wrong type, strip it and return the required properties). There will also be a strict mode that does not do type coercion.
