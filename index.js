'use strict';

var self = module.exports;

var verbose = true;

self.setVerbose = function (flag) {
    if (flag) verbose = true;
};

self.validate = function (params, schema) {

    // Check that every required property exists
    var missingProperties = [];

    Object.keys(schema).forEach(function (requiredProperty) {
        if (!params[requiredProperty]) {
            return missingProperties.push(requiredProperty);
        }
    });

    if (missingProperties.length) {
        if (verbose) console.error('Missing properties:' + missingProperties.join(', '));
        return false;
    }

    // Check that every request is of the required type
    var incorrectTypes = [];

    Object.keys(schema).forEach(function (requiredProperty) {
        var type = schema[requiredProperty],
            value = params[requiredProperty];

        if (type === 'date' && new Date(type).toString() === 'Invalid Date') {
            return incorrectTypes.push(requiredProperty);
        }

        else if (type === 'array' && !Array.isArray(type)) {

        }

        else if (typeof params[requiredProperty] !== schema[requiredProperty]) {
            return incorrectTypes.push(requiredProperty);
        }
    });

    if (incorrectTypes.length) {
        if (verbose) console.error('Incorrect types:' + incorrectTypes.join(', '));
        return false;
    }

    // Strip params of unspecified properties

    var cleanParams = {};

    Object.keys(schema).forEach(function (requiredProperty) {
        cleanParams[requiredProperty] = params[requiredProperty];
    });

    return cleanParams;
};
