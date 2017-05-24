'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function checkPropertyType(typeName, value, types, opts) {
    var isArray = void 0;
    var func = void 0;

    // If RegExp literal is passed, convert to function
    if (typeName instanceof RegExp) {
        func = function regex(item) {
            var rez = !typeName.test(item);
            if (rez) {
                return {
                    valid: false
                };
            }

            return {
                valid: true,
                value: value.toString()
            };
        };
    } else {
        // Check for array syntax around type E.g. '[string]?'
        isArray = /^\[(\w+)\]\??$/.exec(typeName);

        if (isArray) {
            typeName = isArray[1];
        }

        func = typeof typeName === 'function' ? typeName : types[typeName];
    }

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

            throw new Error('Invalid value: ' + result.originalValue + ' for type: ' + typeName);
        }

        return result.originalValue;
    });

    if (isArray) {
        return returnValues;
    }
    return returnValues.pop();
}

// Sets all properties to their clean value or null
function checkPropertiesTypes(params, schema, types, opts, valid, invalid) {
    valid = valid || {};
    invalid = invalid || {};

    Object.keys(schema).forEach(function (propertyName) {

        var typeName = schema[propertyName],
            value = params[propertyName];

        // Don't check optional properties that don't exist
        if (!params.hasOwnProperty(propertyName)) {
            return;
        }

        // Check nested objects
        if ((typeof typeName === 'undefined' ? 'undefined' : _typeof(typeName)) === 'object' && !(typeName instanceof RegExp) && !Array.isArray(typeName)) {
            valid[propertyName] = {};
            invalid[propertyName] = {};

            checkPropertiesTypes(value, typeName, types, opts, valid[propertyName], invalid[propertyName]);
        } else {
            try {
                valid[propertyName] = checkPropertyType(typeName, value, types, opts);
            } catch (err) {
                invalid[propertyName] = err;
            }
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