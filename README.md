valid-props
===========

## VERSION
0.0.3

## SYNOPSIS
NPM module that verifies if a JavaScript Object contains valid pre-defined properties. Useful for REST web services to confirm that JSON POST requests contain the expected information.

## IMPORTANT
This module is still under active development and the API may radically change.

## METHODS
The valid-props module has only one method: validate(object, schema)
It accepts an object as the first parameter and compares it to the schema object in the second parameter.

All the properties declared in the schema are required, and if the object being checking is missing a property or the property is of a different type the value "undefined" will be returned.

If the object contains all the properties of the correct type then an object is returned with those values. Any additional undeclared properties from the object are stripped.

If an optional property is declared, the method will behave as normal if the property is not included in the object. If the property is present and the correct type it will be returned with the resultant object. If the optional property is the incorrect type the entire result value will be undefined. 

NOTE: The validate method will do type coercion and return the specified type in the result object.

## EXAMPLE

    var props = require('valid-props');

    function (req, res) {
        var params = props.validate(req.body, {
            username: 'string',
            password: 'string',
            age: 'number',
            foo: 'array',
            bar: 'object',
            optional: {
                baz: 'boolean'
            }
        });

        if (!params) return res.send('error')

        res.send('success')
    }

# BUGS AND LIMITATIONS
Optional object parameters are declared in a property named "optional" preventing "optional" from being an available property.

# TODO
Future versions of this module will have behavior switches to enable more control over how invalid objects are handled (throw an error, vs return undefined), and how optional parameters are handled (if the optional property is the wrong type, strip it and return the required properties). There will also be a strict mode that does not do type coercion.
