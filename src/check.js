'use strict';

function checkPropertyType(typeName, value, types, opts) {
    // TODO (Doug): Not checking types yet
    const isArray = /\[(\w+)\]/.exec(typeName);

    if (isArray) {
        typeName = isArray[1];
    }

    const func = typeof typeName === 'function' ? typeName : types[typeName];

    let result;

    if (func === undefined) {
        throw new Error(`Invalid type: ${typeName}`);
    }

    try {
        if (isArray) {
            result = [];
            value.forEach(item => {
                result.push(func(item));
            });
        }
        result = func(value);
    } catch (err) {
        throw new Error(`Invalid value: ${value} for type: ${typeName}`);
    }

    if (result === undefined || result === false || result === null) {
        throw new Error(`Invalid value: ${value} for type: ${typeName}`);
    }

    if (typeof result === 'object' && result.hasOwnProperty('valid')) {
        if (result.valid) {
            if (!opts.strict && result.newValue) {
                return result.newValue;
            }
            return value;
        }

        throw new Error(`Invalid value for: ${typeName}`);
    }

    return value;
}

// Sets all properties to their clean value or null
function checkPropertiesTypes(params, schema, types, opts) {
    const valid = {},
        invalid = {};

    Object.keys(schema).forEach(propertyName => {

        const typeName = schema[propertyName],
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
        valid,
        invalid,
    };
}
