'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function checkPropertyType(typeName, value, types, opts) {
    if ((typeof typeName === 'undefined' ? 'undefined' : _typeof(typeName)) === 'object') {}

    var isArray = /\[(\w+)\]/.exec(typeName);

    if (isArray) {
        typeName = isArray[1];
    }

    var func = typeof typeName === 'function' ? typeName : types[typeName];

    var results = [];

    if (func === undefined) {
        throw new Error('Invalid type: ' + typeName);
    }

    try {
        if (isArray) {
            value.forEach(function (item) {
                results.push({
                    originalValue: item,
                    result: func(item)
                });
            });
            console.log("here");
            console.dir(results);
        } else {
            results.push({
                originalValue: value,
                result: func(value)
            });
        }
    } catch (err) {
        throw new Error('Invalid value: ' + value + ' for type: ' + typeName);
    }

    var returnValues = results.map(function (result) {
        console.log('\'ere');
        console.dir(result);
        if (result.result === undefined || result.result === false || result.result === null) {
            throw new Error('Invalid value: ' + value + ' for type: ' + typeName);
        }

        if (_typeof(result.result) === 'object' && result.result.hasOwnProperty('valid')) {
            if (result.result.valid) {
                if (!opts.strict && result.result.newValue) {
                    return result.result.newValue;
                }
                return result.originalValue;
            }

            throw new Error('Invalid value for: ' + typeName);
        }

        return result.originalValue;
    });

    if (isArray) {
        console.log('there');
        console.dir(returnValues);
        return returnValues;
    }
    return returnValues.pop();
}

// Sets all properties to their clean value or null
function checkPropertiesTypes(params, schema, types, opts) {
    var valid = {},
        invalid = {};

    Object.keys(schema).forEach(function (propertyName) {

        var typeName = schema[propertyName],
            value = params[propertyName];

        // Don't check optional properties that don't exist
        if (!params.hasOwnProperty(propertyName)) {
            return;
        }

        if ((typeof typeName === 'undefined' ? 'undefined' : _typeof(typeName)) === 'object') {
            var foo = checkPropertiesTypes(value, typeName, types, opts).valid;
            valid[propertyName] = foo.valid;
            if (foo.invalid.length) {
                throw foo.invalid;
            }
        }

        try {
            valid[propertyName] = checkPropertyType(typeName, value, types, opts);
        } catch (err) {
            invalid[propertyName] = err;
        }
    });

    return {
        valid: valid,
        invalid: invalid
    };
}

module.exports = {
    propertiesTypes: checkPropertiesTypes
};