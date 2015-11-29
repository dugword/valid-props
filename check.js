'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function checkPropertyType(typeName, value, types, opts) {
    // TODO (Doug): Not checking types yet
    var isArray = /\[(\w+)\]/.exec(typeName);

    if (isArray) {
        typeName = isArray[1];
    }

    var func = typeof typeName === 'function' ? typeName : types[typeName];

    var result = undefined;

    if (func === undefined) {
        throw new Error('Invalid type: ' + typeName);
    }

    try {
        if (isArray) {
            result = [];
            value.forEach(function (item) {
                result.push(func(item));
            });
        }
        result = func(value);
    } catch (err) {
        throw new Error('Invalid value: ' + value + ' for type: ' + typeName);
    }

    if (result === undefined || result === false || result === null) {
        throw new Error('Invalid value: ' + value + ' for type: ' + typeName);
    }

    if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object' && result.hasOwnProperty('valid')) {
        if (result.valid) {
            if (!opts.strict && result.newValue) {
                return result.newValue;
            }
            return value;
        }

        throw new Error('Invalid value for: ' + typeName);
    }

    return value;
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