'use strict';

var self = module.exports;

var verbose = true;

var arrayRegex = /\[(string|number|boolean|date|object|array)]/;

var checker = {};

// Casts value as string,
// this will always be valid unless the string is empty
checker.string = function (value) {
    return String(value);
};

checker.number = function (value) {
    value = parseFloat(value);

    if (isNaN(value)) {
        return;
    }

    return value;
};

checker.date = function (value) {
    value = new Date(value);

    if (value.toString() === 'Invalid Date') {
        return;
    }

    return value;
};

checker.array = function (value) {
    if (!Array.isArray(value)) {
        return;
    }

    return value;
};

checker.typedArray = function (value, type) {
    if (!Array.isArray(value)) {
        return;
    }

    var incorrectValues = value.filter(function (item) {
        return !checker[type](item);
    });

    if (incorrectValues.length) {
        return;
    }

    return value;
};

checker.object = function (value) {
    if (typeof value !== 'object') {
        return;
    }
    return value;
};

// TODO: False is a valid value, but will be skipped as invalid
checker.boolean = function (value) {
    return Boolean(value);
};

// Private Methods

var checkForMissingProperties = function (params, schema) {
    return Object.keys(schema).filter(function (requiredProperty) {
        if (!params[requiredProperty]) return requiredProperty;
    });
};

var checkPropertiesTypes = function (params, schema) {
    return Object.keys(schema).filter(function (requiredProperty) {
        var requiredType = schema[requiredProperty],
            value = params[requiredProperty];

        if (requiredType === 'string') {
            return !checker.string(value);
        }

        if (requiredType === 'number') {
            return !checker.number(value);
        }

        if (requiredType === 'boolean') {
            return !checker.boolean(value);
        }

        if (requiredType === 'array') {
            return !checker.array(value);
        }

        if (requiredType === 'object') {
            return !checker.object(value);
        }

        if (requiredType === 'date') {
            return !checker.date(value);
        }

        if (arrayRegex.test(requiredType)) {
            var arrayType = arrayRegex.exec(requiredType)[1];
            return !checker.typedArray(value, arrayType);
        }

        return;
    });
};

// Public Methods

self.setVerbose = function (flag) {
    if (flag) verbose = true;
};

self.validate = function (params, schema) {
    var optional = schema.optional || {};
    delete schema.optional;


    // Check that every required property exists
    var missingProperties = checkForMissingProperties(params, schema);
    if (missingProperties.length) {
        if (verbose) console.error('Missing properties:',  missingProperties.join(', '));
        return;
    }

    // Check that every required property is of the required type
    var incorrectTypes = checkPropertiesTypes(params, schema);
    if (incorrectTypes.length) {
        if (verbose) console.error('Incorrect required type:', incorrectTypes.join(', '));
        return;
    }


    // Check that every optional request is of the required type
    // TODO: Evaluate whether it makes sense to fail here or just stip the optional properties
    incorrectTypes = checkPropertiesTypes(params, optional);
    if (incorrectTypes.length) {
        if (verbose) console.error('Incorrect optional type:', incorrectTypes.join(', '));
        return;
    }


    // Strip params of unspecified properties
    var cleanParams = {};

    Object.keys(schema).forEach(function (requiredProperty) {
        cleanParams[requiredProperty] = params[requiredProperty];
    });

    Object.keys(optional).forEach(function (optionalProperty) {
        if (params[optionalProperty]) {
            cleanParams[optionalProperty] = params[optionalProperty];
        }
    });


    return cleanParams;
};
