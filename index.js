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
        var requiredType = schema[requiredProperty],
            value = params[requiredProperty];

        // Don't check types on missing properties
        if (!value) return;

        if (requiredType === 'date') {
            value = new Date(value);
            if (value.toString() === 'Invalid Date') {
                return incorrectTypes.push(requiredProperty + ' not a valid date');
            }
            params[requiredProperty] = value;
        }

        else if (requiredType === 'array') {
            if (!Array.isArray(value)) {
                return incorrectTypes.push(requiredProperty + ' not an array');
            }
        }

        else if (requiredType === 'number') {
            value = Number(value);
            if (isNaN(value)) {
                return incorrectTypes.push(requiredProperty + ' not a number');
            }
            params[requiredProperty] = value;
        }

        else {
            if (typeof params[requiredProperty] !== schema[requiredProperty]) {
                return incorrectTypes.push(requiredProperty + ' not a ' + requiredType);
            }
        }

    });

    return incorrectTypes;
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
        return false;
    }

    // Check that every required property is of the required type
    var incorrectTypes = checkPropertiesTypes(params, schema);

    if (incorrectTypes.length) {
        if (verbose) console.error('Incorrect required type:', incorrectTypes.join(', '));
        return false;
    }


    // Check that every optional request is of the required type
    incorrectTypes = checkPropertiesTypes(params, optional);

    if (incorrectTypes.length) {
        if (verbose) console.error('Incorrect optional type:', incorrectTypes.join(', '));
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
