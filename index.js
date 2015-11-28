'use strict';

const standardTypes = require('./standard-types');

function checkPropertyType(typeName, value, types, opts) {
    console.log('typeName =>', typeName);
    console.log('value =>', value);
    console.log('types =>', types);
    console.log('opts =>', opts);
    const func = types[typeName];

    let result;

    if (func === undefined) {
        throw new Error(`Invalid type: ${typeName}`);
    }

    try {
        result = func(value);
    }

    catch (err) {
        throw new Error(`Invalid value: ${value} for type: ${typeName}`);
    }

    if (result === undefined || result === false || result === null) {
        throw new Error(`Invalid value: ${value} for type: ${typeName}`);
    }

    if (typeof result === 'object' && result.valid) {
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

function verifyPropertiesExist(params, schema) {
    const missingProperties = Object.keys(schema).filter(function (key) {
        return !params.hasOwnProperty([key]);
    });

    if (missingProperties.length) {
        let errorMsg = 'Missing properties: ' + missingProperties.join(', ');
        throw new Error(errorMsg);
    }
}

function createValidProps(opts) {
    const types = [],
        schemas = [];

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
        console.log('types =>', types);
        try {
            optional = optional || {};

            // Move all optional properties to the optional object
            Object.keys(schema).forEach(function (key) {
                if (schema[key].slice(-1) === '?') {
                    optional[key] = schema[key].slice(0, -1);
                    delete schema[key];
                }
            });

            verifyPropertiesExist(params, schema);

            // Check that every required property is of the required type
            const checkedParams = checkPropertiesTypes(params, schema);
            const validParams = checkedParams.valid;
            const invalidParams = checkedParams.invalid;

            // Check that every optional request is of the required type
            const checkedOptionalParams = checkPropertiesTypes(params, optional, types);
            const validOptionalParams = checkedOptionalParams.valid;
            const invalidOptionalParams = checkedOptionalParams.invalid;

            // Join the valid optional params to the valid required types
            Object.keys(validOptionalParams).forEach(function (key) {
                validParams[key] = validOptionalParams[key];
            });

            // Join the invalid optional params to the invalid required types
            Object.keys(invalidOptionalParams).forEach(function (key) {
                invalidParams[key] = invalidOptionalParams[key];
            });

            if (Object.keys(invalidParams).length) {
                let errorMessage;

                Object.keys(invalidParams).forEach(propertyName => {
                    errorMessage += invalidParams[propertyName] + '\n';
                });

                throw new Error(errorMessage);
            }


            // TODO: This was a bugfix, needs a test
            if (Object.keys(validParams).length === 0) {
                throw new Error('No valid properties');
            }

            return validParams;
        }
        catch (err) {
            throw err;
        }
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
        Object.keys(object).forEach(function (key) {
            const property = object[key];
            object.__defineGetter__(key, function () {
                if (!this.__validated) {
                    throw new Error('This object has not been validated');
                }
                return property;
            });
        });

        // Validate the object and set the internal flag
        Object.defineProperty(object, 'validate', {
            value: function (schema, optional) {
                this.__validated = true;
                return validate(object, schema, optional);
            },
            writable: false,
            enumerable: false,
            configurable: false
        });
    }

    function use(plugin) {
        console.log('use =>', plugin);
        Object.keys(plugin).forEach(name => {
            registerType(name, plugin[name]);
        });
    }

    function registerType(name, func) {
        console.log('registerType =>', name);
        console.log('func =>', func.toString());
        const type = {};
        type[name] = func;
        types.push(type);
    }

    function registerSchema(name, schema, optionalSchema) {
        schemas.push({
            name, schema, optionalSchema
        });
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


/*
    props.registerType('number', function () {

    });

    props.validate({foo: 'bar', {foo: function (value) {
        if (value === 'bar') {
            return true;
        }
        else {
            return false;
        }
    }});
*/

module.exports = (function () {
    const props = createValidProps();
    props.use(standardTypes);
    props.create = createValidProps;
    return props;
}());
