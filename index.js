'use strict';

var self = module.exports;

var verbose = false;

var arrayRegex = /\[(string|number|boolean|date|object|array)]/;

var checker = {};

// Casts value as string,
// this will always be valid unless the string is empty
checker.string = function(value) {
    // TODO (Doug): This may not capture everything we want
    if (!value) {
        return null;
    }
    return value.toString();
};

checker.number = function(value) {
    value = parseFloat(value);

    if (isNaN(value)) {
        return null;
    }

    return value;
};

checker.date = function(value) {
    value = new Date(value);

    if (value.toString() === 'Invalid Date') {
        return null;
    }

    return value;
};

checker.array = function(value) {
    if (!Array.isArray(value)) {
        return null;
    }

    return value;
};

// TODO (Doug): I'm sure this isn't working right
checker.typedArray = function(value, type) {
    var cleanArray = [];
    if (!Array.isArray(value)) {
        return null;
    }

    value.forEach(function (item) {
        cleanArray.push(checker[type](item));
    });

    var incorrectValues = cleanArray.filter(function(item) {
        return (item === null);
    });

    if (incorrectValues.length) {
        return null;
    }

    return cleanArray;
};

// TODO (Doug): This needs some work
checker.object = function(value) {
    if (typeof value !== 'object') {
        return null;
    }

    return value;
};

// TODO (Doug): May want to re-evaluate this
checker.boolean = function(value) {
    if (value === undefined || value === null) {
        return null;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    if (value === 1 || value === '1') {
        return true;
    }

    if (value === 0 || value === '0') {
        return false;
    }

    if (/^true$/i.test(value)) {
        return true;
    }

    if (/^false$/i.test(value)) {
        return false;
    }

    return null;
};


// Sets all properties to their clean value or null
var checkPropertiesTypes = function(params, schema) {
    var cleanParams = {};

    Object.keys(schema).forEach(function(key) {
        var requiredType = schema[key],
            value = params[key];

        // Don't check properties that don't exist
        if (!params.hasOwnProperty(key)) {
            return;
        }

        if (arrayRegex.test(requiredType)) {
            var arrayType = arrayRegex.exec(requiredType)[1];
            cleanParams[key] = checker.typedArray(value, arrayType);
            return;
        }

        cleanParams[key] = checker[requiredType](value);
    });

    return cleanParams;
};

// Public Methods

self.setVerbose = function(flag) {
    if (flag === undefined) return (verbose = true);
    if (flag) return (verbose = true);
    verbose = false;
};

self.validate = function(params, schema, optional) {
    var cleanParams = {},
        cleanOptionalParams = {};

    optional = optional || {};

    // Check that every required property exists
    var missingProperties = Object.keys(schema).filter(function(key) {
        return (!params.hasOwnProperty([key]));
    });

    if (missingProperties.length) {
        if (verbose) {
            console.error('Missing properties:', missingProperties.join(', '));
        }

        return null;
    }

    // Check that every required property is of the required type
    cleanParams = checkPropertiesTypes(params, schema);
    var incorrectTypes = Object.keys(cleanParams).filter(function (key) {
        return (cleanParams[key] === null);
    });
    if (incorrectTypes.length) {
        if (verbose) {
            console.error('Incorrect required type:', incorrectTypes.join(', '));
        }

        return null;
    }


    // Check that every optional request is of the required type
    cleanOptionalParams = checkPropertiesTypes(params, optional);
    var incorrectOptionalTypes = Object.keys(cleanOptionalParams).filter(function (key) {
        return (cleanOptionalParams[key] === null);
    });
    if (incorrectOptionalTypes.length) {
        if (verbose) {
            console.error('Incorrect optional type:', incorrectOptionalTypes.join(', '));
        }

        return null;
    }

    // Join the cleaned optional types to the cleaned required types
    Object.keys(cleanOptionalParams).forEach(function (key) {
        cleanParams[key] = cleanOptionalParams[key];
    });

    return cleanParams;
};

self.attach = function (object) {
    // Set hidden flag to determine if object has been validated
    Object.defineProperty(object, '__validated', {
        value: false,
        enumerable: false,
        configurable: false,
        writable: true
    });
   
    // Replace all properties with getters, throw an error if not validated
    Object.keys(object).forEach(function (key) {
        var property = object[key];
        object.__defineGetter__(key, function () {
            if (!this.__validated) throw new Error('This object has not been validated');
            return property;
        });
    });

    // Validate the object and set the internal flag
    Object.defineProperty(object, 'validate', {
        value: function (schema, optional) {
            this.__validated = true;
            return self.validate(object, schema, optional);
        },
        writable: false,
        enumerable: false,
        configurable: false
    });
};
