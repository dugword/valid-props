'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var standardTypes = require('./standard-types'),
    check = require('./check'),
    verify = require('./verify');

function checkInvalidResults(invalidParams, errors) {
    errors = errors || [];
    Object.keys(invalidParams).forEach(function (propertyName) {
        var value = invalidParams[propertyName];
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !(value instanceof Error)) {
            return checkInvalidResults(value, errors);
        } else {
            errors.push(value);
        }
    });

    return errors;
}

function create(opts) {
    var self = {
        attach: attach,
        createSchemaValidator: createSchemaValidator,
        validate: validate,
        setVerbose: setVerbose,
        registerType: registerType,
        registerSchema: registerSchema,
        use: use,
        create: create
    };

    var types = {},
        schemas = {};

    use(standardTypes);

    opts = opts || {};

    var errorType = opts.errorType;
    // apiVersion = opts.apiVersion;

    var verbose = false;

    // Public Methods

    function setVerbose(flag) {
        if (flag) {
            verbose = true;
        }

        return self;
    }

    function validate(params, schema, optional) {
        try {
            if (typeof schema === 'string') {
                var schemaName = schema;
                // Check for invalid/unregistered schemas
                if (!schemas.hasOwnProperty(schemaName)) {
                    throw new Error('No schema named ' + schemaName + ' defined');
                }

                schema = schemas[schemaName].schema;
                optional = schemas[schemaName].optionalSchema;
            }

            optional = optional || {};

            // Move all optional properties to the optional object
            Object.keys(schema).forEach(function (key) {
                if (typeof schema[key] === 'string' && schema[key].slice(-1) === '?') {
                    optional[key] = schema[key].slice(0, -1);
                    delete schema[key];
                }
            });

            verify.propertiesExist(params, schema);

            // Check that every required property is of the required type
            var checkedParams = check.propertiesTypes(params, schema, types, opts);
            var validParams = checkedParams.valid;
            var invalidParams = checkedParams.invalid;

            // Check that every optional request is of the required type
            var checkedOptionalParams = check.propertiesTypes(params, optional, types, opts);
            var validOptionalParams = checkedOptionalParams.valid;
            var invalidOptionalParams = checkedOptionalParams.invalid;

            // Join the valid optional params to the valid required types
            Object.keys(validOptionalParams).forEach(function (key) {
                validParams[key] = validOptionalParams[key];
            });

            // Join the invalid optional params to the invalid required types
            Object.keys(invalidOptionalParams).forEach(function (key) {
                invalidParams[key] = invalidOptionalParams[key];
            });

            // Throws if any non-empty objects exist
            var errors = checkInvalidResults(invalidParams);
            if (errors.length) {
                throw new Error(errors.join('\n'));
            }

            /*
            // TODO: This was a bugfix, needs a test
            if (Object.keys(validParams).length === 0) {
                throw new Error('No valid properties');
            }
             */

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
        Object.keys(object).forEach(function (key) {
            var property = object[key];
            object.__defineGetter__(key, function () {
                if (!this.__validated) {
                    throw new Error('This object has not been validated');
                }
                return property;
            });
        });

        // Validate the object and set the internal flag
        Object.defineProperty(object, 'validate', {
            value: function value(schema, optional) {
                this.__validated = true;
                return validate(object, schema, optional);
            },
            writable: false,
            enumerable: false,
            configurable: false
        });
    }

    function use(plugin) {
        Object.keys(plugin).forEach(function (name) {
            var func = plugin[name];

            // Fail safe when importing plugins
            if (typeof func !== 'function' || func.length !== 1) {
                return console.error('Failed to register type ' + name);
            }

            registerType(name, func);
        });

        return self;
    }

    function registerType(name, func) {
        if (arguments.length === 1 && Array.isArray(arguments[0])) {
            arguments[0].forEach(function (type) {
                return registerType(type);
            });
            return self;
        }

        if (arguments.length === 1 && arguments[0].name) {
            name = arguments[0].name;
            func = arguments[0];
        }

        if (typeof func !== 'function' || func.length !== 1) {
            throw new Error('Failed to register type ' + name);
        }

        types[name] = func;

        return self;
    }

    function registerSchema(name, schema, optionalSchema) {
        if (arguments.length === 1 && Array.isArray(arguments[0])) {
            arguments[0].forEach(function (schema) {
                return registerSchema(schema);
            });
            return self;
        }

        if (arguments.length === 1 && arguments[0] !== null && _typeof(arguments[0]) === 'object') {
            name = arguments[0].name;
            schema = arguments[0].schema;
            optionalSchema = arguments[0].optionalSchema;
        }

        if (typeof name !== 'string') {
            throw new Error('Failed to register schema: ' + name);
        }

        if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) !== 'object' || schema === null) {
            throw new Error('Failed to register schema: ' + name);
        }

        if (optionalSchema && (typeof optionalSchema === 'undefined' ? 'undefined' : _typeof(optionalSchema)) !== 'object') {
            throw new Error('Failed to register schema: ' + name);
        }

        schemas[name] = {
            schema: schema, optionalSchema: optionalSchema
        };

        return self;
    }

    function createSchemaValidator(schema, optional) {
        return function schemaValidator(params) {
            return validate(params, schema, optional);
        };
    }

    return self;
}

module.exports = create();