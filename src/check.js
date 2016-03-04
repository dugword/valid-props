'use strict';

function checkPropertyType(typeName, value, types, opts) {
    let isArray, func;
    // If RegExp literal is passed, convert to function
    if (typeName instanceof RegExp) {
        func = function regex(item) {
            let rez = !typeName.test(item);
            if (rez) {
                return {
                    valid: false,
                };
            }

            return {
                valid: true,
                value: value.toString(),
            };
        };
    }
    else {
        // Check for array syntax around type E.g. '[string]?'
        isArray = /^\[(\w+)\]\??$/.exec(typeName);

        if (isArray) {
            typeName = isArray[1];
        }

        func = typeof typeName === 'function' ? typeName : types[typeName];
    }

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

            throw new Error(`Invalid value: ${result.originalValue} for type: ${typeName}`);
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

        let typeName = schema[propertyName],
            value = params[propertyName];

        // Don't check optional properties that don't exist
        if (!params.hasOwnProperty(propertyName)) {
            return;
        }

        // TODO (Doug) Add comments, I forgot why this is here
        if (typeof typeName === 'object' && !(typeName instanceof RegExp)) {
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
