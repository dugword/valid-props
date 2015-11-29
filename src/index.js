'use strict';

const standardTypes = require('./standard-types'),
      check = require('./check'),
      verify = require('./verify');

function createValidProps(opts) {
    const self = {
        attach,
        create: createValidProps,
            validate,
            setVerbose,
            registerType,
            registerSchema,
            use,
    };

    const types = {},
        schemas = {};

    use(standardTypes);

    opts = opts || {};

    let errorType = opts.errorType;
    // apiVersion = opts.apiVersion;

    let verbose = false;

    // Public Methods

    function setVerbose(flag) {
        if (flag) {
            verbose = true;
        }

        return self;
    }

    function validate(params, schema, optional) {
        try {
            optional = optional || {};

            if (typeof schema === 'string') {
                schema = schemas[schema].schema;
                optional = schemas[schema].optionalSchema;
            }

            // Move all optional properties to the optional object
            Object.keys(schema).forEach(function(key) {
                if (typeof schema[key] === 'string' && schema[key].slice(-1) === '?') {
                    optional[key] = schema[key].slice(0, -1);
                    delete schema[key];
                }
            });

            verify.propertiesExist(params, schema);

            // Check that every required property is of the required type
            const checkedParams = check.propertiesTypes(params, schema, types, opts);
            const validParams = checkedParams.valid;
            const invalidParams = checkedParams.invalid;

            // Check that every optional request is of the required type
            const checkedOptionalParams = check.propertiesTypes(params, optional, types, opts);
            const validOptionalParams = checkedOptionalParams.valid;
            const invalidOptionalParams = checkedOptionalParams.invalid;

            // Join the valid optional params to the valid required types
            Object.keys(validOptionalParams).forEach(function(key) {
                validParams[key] = validOptionalParams[key];
            });

            // Join the invalid optional params to the invalid required types
            Object.keys(invalidOptionalParams).forEach(function(key) {
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
        } catch (err) {
            if (errorType === 'returnNull') {
                return null;
            }

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

    function use(plugin) {
        Object.keys(plugin).forEach(name => {
            registerType(name, plugin[name]);
        });

        return self;
    }

    function registerType(name, func) {
        types[name] = func;

        return self;
    }

    function registerSchema(name, schema, optionalSchema) {
        schemas[name] = {
            schema, optionalSchema
        };

        return self;
    }

    return self;
}

module.exports = createValidProps();
