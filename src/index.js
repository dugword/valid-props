'use strict';


const arrayRegex = /\[(string|number|boolean|date|object|array)\]/;

const validTypes = [
    'string',
    'number',
    'int',
    'function',
    'boolean',
    'date',
    'object',
    'array',
];


const checker = createChecker();

function createChecker() {
    // Casts value as string,
    // this will always be valid unless the string is empty
    function string(value) {
        // TODO (Doug): This may not capture everything we want
        if (!value) {
            return null;
        }

        return value.toString();
    }

    function number(value) {
        value = parseFloat(value);

        if (isNaN(value)) {
            return null;
        }

        return value;
    }

    function date(value) {
        value = new Date(value);

        if (value.toString() === 'Invalid Date') {
            return null;
        }

        return value;
    }

    function array(value, apiVersion) {
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
    }

    // TODO (Doug): I'm sure this isn't working right
    function typedArray(value, type, apiVersion) {
        const cleanArray = [];

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

        const incorrectValues = cleanArray.filter(function(item) {
            return item === null;
        });

        if (incorrectValues.length) {
            return null;
        }

        return cleanArray;
    }

    // TODO (Doug): This needs some work
    function object(value, apiVersion) {
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
    }

    // TODO (Doug): May want to re-evaluate this
    function boolean(value) {
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
    }

    return {
        string,
        number,
        date,
        array,
        object,
        typedArray,
        boolean
    };

}

// Sets all properties to their clean value or null
function checkPropertiesTypes(params, schema, apiVersion) {
    const cleanParams = {};

    Object.keys(schema).forEach(key => {
        const requiredType = schema[key],
            value = params[key];

        // Don't check properties that don't exist
        if (!params.hasOwnProperty(key)) {
            return;
        }

        if (arrayRegex.test(requiredType)) {
            const arrayType = arrayRegex.exec(requiredType)[1];
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
}

function createValidProps(opts) {

    const validTypes = [
        'string',
        'number',
        'int',
        'function',
        'boolean',
        'date',
        'object',
        'array',
    ];

    opts = opts || {};
    let errorType = opts.errorType,
        apiVersion = opts.apiVersion;

    let verbose = false;

    // Public Methods

    function setVerbose(flag) {
        if (flag === undefined) {
            verbose = true;
            return;
        }
        if (flag) {
            verbose = true;
            return;
        }
        verbose = false;
    }

    function validate(params, schema, optional) {
        optional = optional || {};

        Object.keys(schema).forEach(function(key) {
            if (schema[key].slice(-1) === '?') {
                optional[key] = schema[key].slice(0, -1);
                delete schema[key];
            }
        });

        // Check that every required property exists
        const missingProperties = Object.keys(schema).filter(function(key) {
            return !params.hasOwnProperty([key]);
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
        const cleanParams = checkPropertiesTypes(params, schema, apiVersion);
        const incorrectTypes = Object.keys(cleanParams).filter(function(key) {
            return cleanParams[key] === null;
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
        const cleanOptionalParams = checkPropertiesTypes(params, optional, apiVersion);
        const incorrectOptionalTypes = Object.keys(cleanOptionalParams).filter(function(key) {
            return cleanOptionalParams[key] === null;
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
            const property = object[key];
            object.__defineGetter__(key, function() {
                if (!this.__validated) {
                    throw new Error('This object has not been validated');
                }
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

    function registerType(name, func) {
        validTypes.push(name);

    }

    function registerSchema(name, schema, optionalSchema) {

    }

    return {
        attach,
        validate,
        setVerbose,
        registerType,
        registerSchema,
        use,
    };
}

module.exports = (function() {
    const props = createValidProps();
    props.create = createValidProps;
    return props;
}());
