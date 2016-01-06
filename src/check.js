'use strict';

function checkPropertyType(typeName, value, types, opts) {
    if (typeof typeName === 'object') {

    }

    const isArray = /\[(\w+)\]/.exec(typeName);

    if (isArray) {
        typeName = isArray[1];
    }

    const func = typeof typeName === 'function' ? typeName : types[typeName];

    let results = [];

    if (func === undefined) {
        throw new Error(`Invalid type: ${typeName}`);
    }

    try {
        if (isArray) {
            value.forEach(item => {
                results.push({
                    originalValue: item,
                    result: func(item),
                });
            });
        }
        else {
            results.push({
                originalValue: value,
                result: func(value),
            });
        }
    }
    catch (err) {
        throw new Error(`Invalid value: ${value} for type: ${typeName}`);
    }

    const returnValues = results.map(result => {
        if (result.result === undefined || result.result === false || result.result === null) {
            throw new Error(`Invalid value: ${value} for type: ${typeName}`);
        }

        if (typeof result.result === 'object' && result.result.hasOwnProperty('valid')) {
            if (result.result.valid) {
                if (!opts.strict && result.result.newValue) {
                    return result.result.newValue;
                }
                return result.originalValue;
            }

            throw new Error(`Invalid value for: ${typeName}`);
        }

        return result.originalValue;
    });

    if (isArray) {
        return returnValues;
    }
    return returnValues.pop();

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

        if (typeof typeName === 'object') {
            const foo = checkPropertiesTypes(value, typeName, types, opts).valid;
            valid[propertyName] = foo.valid;
            if (foo.invalid.length) {
                throw foo.invalid;
            }
        }

        try {
            valid[propertyName] = checkPropertyType(typeName, value, types, opts);
        }
        catch (err) {
            invalid[propertyName] = err;
        }
    });

    return {
        valid,
        invalid,
    };
}

module.exports = {
    propertiesTypes: checkPropertiesTypes,
};
