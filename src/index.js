'use strict';

let verbose = false;

const arrayRegex = /\[(string|number|boolean|date|object|array)]/;

const validTypes = [
    'string',
    'number',
    'boolean',
    'date',
    'object',
    'array'
];

function createValidProps() {
    const checker = {};

    let _errorType,
        _apiVersion;

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

    checker.array = function(value, apiVersion) {
        if (!Array.isArray(value)) {
            return null;
        }
        if (apiVersion >= 1.5) {
            // Reject empty arrays (Why would they pass that?)
            if (!value.length) {
                return null;
            }
        }

        return value;
    };

    // TODO (Doug): I'm sure this isn't working right
    checker.typedArray = function(value, type, apiVersion) {
        var cleanArray = [];
        if (!Array.isArray(value)) {
            return null;
        }

        if (apiVersion >= 1.5) {
            // Reject empty arrays (Why would they pass that?)
            if (!value.length) {
                return null;
            }
        }

        value.forEach(function(item) {
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
    checker.object = function(value, apiVersion) {
        if (typeof value !== 'object') {
            return null;
        }
        // Reject empty objects
        if (apiVersion >= 1.5) {
            if (!Object.keys(value).length) {
                return null;
            }
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
    var checkPropertiesTypes = function(params, schema, apiVersion) {
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
                if (validTypes.indexOf(arrayType) === -1) {
                    throw new Error('Invalid type in schema: ' + arrayType);
                }
                cleanParams[key] = checker.typedArray(value, arrayType, apiVersion);
                return;
            }

            if (validTypes.indexOf(requiredType) === -1) {
                throw new Error('Invalid type in schema: ' + requiredType);
            }

            cleanParams[key] = checker[requiredType](value, apiVersion);
        });

        return cleanParams;
    };

    // Public Methods

    function setVerbose(flag) {
        if (flag === undefined) return (verbose = true);
        if (flag) return (verbose = true);
        verbose = false;
    }

    function validate(params, schema, optional, errorType, apiVersion) {
        // If no errorType is specified, check for global errorType
        if (errorType === undefined) {
            errorType = _errorType;
        }
        if (apiVersion === undefined) {
            apiVersion = _apiVersion;
        }

        var cleanParams = {},
            cleanOptionalParams = {};

        optional = optional || {};

        Object.keys(schema).forEach(function(key) {
            if (schema[key].slice(-1) === '?') {
                optional[key] = schema[key].slice(0, -1);
                delete schema[key];
            }
        });

        // Check that every required property exists
        var missingProperties = Object.keys(schema).filter(function(key) {
            return (!params.hasOwnProperty([key]));
        });

        if (missingProperties.length) {
            let errorMsg = 'Missing properties: ' + missingProperties.join(', ');
            if (verbose) {
                console.error(errorMsg);
            }
            if (errorType === 'throw') {
                throw new Error(errorMsg);
            }

            return null;
        }

        // Check that every required property is of the required type
        cleanParams = checkPropertiesTypes(params, schema, apiVersion);
        var incorrectTypes = Object.keys(cleanParams).filter(function(key) {
            return (cleanParams[key] === null);
        });
        if (incorrectTypes.length) {
            let errorMsg = 'Incorrect required type: ' + incorrectTypes.join(', ');
            if (verbose) {
                console.error(errorMsg);
            }
            if (errorType === 'throw') {
                throw new Error(errorMsg);
            }

            return null;
        }


        // Check that every optional request is of the required type
        cleanOptionalParams = checkPropertiesTypes(params, optional, apiVersion);
        var incorrectOptionalTypes = Object.keys(cleanOptionalParams).filter(function(key) {
            return (cleanOptionalParams[key] === null);
        });
        if (incorrectOptionalTypes.length) {
            let errorMsg = 'Incorrect optional type:' + incorrectOptionalTypes.join(', ');
            if (verbose) {
                console.error(errorMsg);
            }
            if (errorType === 'throw') {
                throw new Error(errorMsg);
            }

            return null;
        }

        // Join the cleaned optional types to the cleaned required types
        Object.keys(cleanOptionalParams).forEach(function(key) {
            cleanParams[key] = cleanOptionalParams[key];
        });

        // TODO: This was a bugfix, needs a test
        if (Object.keys(cleanParams).length === 0) {
            return null;
        }

        return cleanParams;
    }

    function create(opts) {
        opts = opts || {};
        const __errorType = opts.errorType,
            __apiVersion = opts.apiVersion;

        return {
            validate: function(params, schema, optional, errorType, apiVersion) {
                errorType = _errorType || __errorType;
                apiVersion = _apiVersion || __apiVersion;
                return validate(params, schema, optional, errorType, apiVersion);
            }
        };
    }

    function attach(object) {
        // Set hidden flag to determine if object has been validated
        Object.defineProperty(object, '__validated', {
            value: false,
            enumerable: false,
            configurable: false,
            writable: true
        });

        // Replace all properties with getters, throw an error if not validated
        Object.keys(object).forEach(function(key) {
            var property = object[key];
            object.__defineGetter__(key, function() {
                if (!this.__validated) throw new Error('This object has not been validated');
                return property;
            });
        });

        // Validate the object and set the internal flag
        Object.defineProperty(object, 'validate', {
            value: function(schema, optional) {
                this.__validated = true;
                return validate(object, schema, optional);
            },
            writable: false,
            enumerable: false,
            configurable: false
        });
    }

    return {
        attach,
        create,
        validate,
        setVerbose,
    };
}

module.exports = createValidProps();
