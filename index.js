'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var standardTypes = require('./standard-types'),
    check = require('./check'),
    verify = require('./verify');

function createValidProps(opts) {
    var self = {
        attach: attach,
        create: createValidProps,
        validate: validate,
        setVerbose: setVerbose,
        registerType: registerType,
        registerSchema: registerSchema,
        use: use
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
            var _ret = (function () {
                optional = optional || {};

                if (typeof schema === 'string') {
                    schema = schemas[schema].schema;
                    optional = schemas[schema].optionalSchema;
                }

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

                if (Object.keys(invalidParams).length) {
                    var errorMessage = undefined;

                    Object.keys(invalidParams).forEach(function (propertyName) {
                        errorMessage += invalidParams[propertyName] + '\n';
                    });

                    throw new Error(errorMessage);
                }

                // TODO: This was a bugfix, needs a test
                if (Object.keys(validParams).length === 0) {
                    throw new Error('No valid properties');
                }

                return {
                    v: validParams
                };
            })();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
            schema: schema, optionalSchema: optionalSchema
        };

        return self;
    }

    return self;
}

module.exports = createValidProps();