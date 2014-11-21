'use strict';

var self = module.exports;

var verbose = true;

// Private Methods

var checkForMissingProperties = function (params, schema) {
    var missingProperties = [];

    Object.keys(schema).forEach(function (requiredProperty) {
        if (!params[requiredProperty]) {
            return missingProperties.push(requiredProperty);
        }
    });

    return missingProperties;
};

var checkPropertiesTypes = function (params, schema) {
    var incorrectTypes = [];

    Object.keys(schema).forEach(function (requiredProperty) {
        var type = schema[requiredProperty],
            value = params[requiredProperty];

        if (type === 'date' && new Date(type).toString() === 'Invalid Date') {
            return incorrectTypes.push(requiredProperty);
        }

        else if (type === 'array' && !Array.isArray(type)) {
            return incorrectTypes.push(requiredProperty);
        }

        else if (typeof params[requiredProperty] !== schema[requiredProperty]) {
            return incorrectTypes.push(requiredProperty);
        }
    });

    return incorrectTypes;
};

// Public Methods

self.setVerbose = function (flag) {
    if (flag) verbose = true;
};

self.validate = function (params, schema) {

    var optional = schema.optional;
    delete schema.optional;

    // Check that every required property exists
    var missingProperties = checkForMissingProperties(params, schema);

    if (missingProperties.length) {
        if (verbose) console.error('Missing properties:' + missingProperties.join(', '));
        return false;
    }

    // Check that every required property is of the required type
    var incorrectTypes = checkPropertiesTypes(params, schema);

    if (incorrectTypes.length) {
        if (verbose) console.error('Incorrect types:' + incorrectTypes.join(', '));
        return false;
    }

    // Check that every optional request is of the required type
    incorrectTypes = checkPropertiesTypes(params, optional);

    if (incorrectTypes.length) {
        if (verbose) console.error('Incorrect types:' + incorrectTypes.join(', '));
        return false;
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
