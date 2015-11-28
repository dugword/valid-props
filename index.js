'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var standardTypes = require('./standard-types');

function checkPropertyType(typeName, value, types, opts) {
    // TODO (Doug): Not checking types yet
    var isArray = /\[(\w+)\]/.exec(typeName);

    if (isArray) {
        typeName = isArray[1];
    }

    var func = typeof typeName === 'function' ? typeName : types[typeName];

    var result = undefined;

    if (func === undefined) {
        throw new Error('Invalid type: ' + typeName);
    }

    try {
        if (isArray) {
            result = [];
            value.forEach(function (item) {
                result.push(func(item));
            });
        }
        result = func(value);
    } catch (err) {
        throw new Error('Invalid value: ' + value + ' for type: ' + typeName);
    }

    if (result === undefined || result === false || result === null) {
        throw new Error('Invalid value: ' + value + ' for type: ' + typeName);
    }

    if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object' && result.hasOwnProperty('valid')) {
        if (result.valid) {
            if (!opts.strict && result.newValue) {
                return result.newValue;
            }
            return value;
        }

        throw new Error('Invalid value for: ' + typeName);
    }

    return value;
}

// Sets all properties to their clean value or null
function checkPropertiesTypes(params, schema, types, opts) {
    var valid = {},
        invalid = {};

    Object.keys(schema).forEach(function (propertyName) {

        var typeName = schema[propertyName],
            value = params[propertyName];

        // Don't check optional properties that don't exist
        if (!params.hasOwnProperty(propertyName)) {
            return;
        }

        try {
            valid[propertyName] = checkPropertyType(typeName, value, types, opts);
        } catch (err) {
            invalid[propertyName] = err;
        }
    });

    return {
        valid: valid,
        invalid: invalid
    };
}

function verifyPropertiesExist(params, schema) {
    var missingProperties = Object.keys(schema).filter(function (key) {
        return !params.hasOwnProperty([key]);
    });

    if (missingProperties.length) {
        var errorMsg = 'Missing properties: ' + missingProperties.join(', ');
        throw new Error(errorMsg);
    }
}

function createValidProps(opts) {
    var types = {},
        schemas = {};

    use(standardTypes);

    opts = opts || {};

    var errorType = opts.errorType;
    // apiVersion = opts.apiVersion;

    var verbose = false;

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

                verifyPropertiesExist(params, schema);

                // Check that every required property is of the required type
                var checkedParams = checkPropertiesTypes(params, schema, types, opts);
                var validParams = checkedParams.valid;
                var invalidParams = checkedParams.invalid;

                // Check that every optional request is of the required type
                var checkedOptionalParams = checkPropertiesTypes(params, optional, types, opts);
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
    }

    function registerType(name, func) {
        types[name] = func;
    }

    function registerSchema(name, schema, optionalSchema) {
        schemas[name] = {
            schema: schema, optionalSchema: optionalSchema
        };
    }

    return {
        attach: attach,
        create: createValidProps,
        validate: validate,
        setVerbose: setVerbose,
        registerType: registerType,
        registerSchema: registerSchema,
        use: use
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

module.exports = createValidProps();