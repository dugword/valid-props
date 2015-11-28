'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

module.exports = {

    number: function number(value) {
        value = parseFloat(value);

        if (isNaN(value)) {
            return {
                valid: false
            };
        }

        return {
            valid: true,
            value: value
        };
    },

    string: function string(value) {
        if (value === undefined || value === null) {
            return {
                valid: false
            };
        }

        return {
            valid: true,
            value: value.toString()
        };
    },

    date: function date(value) {
        value = new Date(value);

        if (value.toString() === 'Invalid Date') {
            return {
                valid: false
            };
        }

        return {
            valid: true,
            value: value
        };
    },

    array: function array(value) {
        if (!Array.isArray(value)) {
            return {
                valid: false
            };
        }

        // Reject empty arrays (Why would they pass that?)
        if (!value.length) {
            return {
                valid: false
            };
        }

        return {
            valid: true,
            value: value
        };
    },

    object: function object(value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
            return {
                valid: false
            };
        }

        if (value === null) {
            return {
                valid: false
            };
        }

        // Reject empty objects
        if (!Object.keys(value).length) {
            return {
                valid: false
            };
        }

        return {
            valid: true,
            value: value
        };
    },

    boolean: function boolean(value) {
        if (value === undefined || value === null) {
            return {
                valid: false
            };
        }

        if (typeof value === 'boolean') {
            return {
                valid: true,
                value: value
            };
        }

        if (value === 1 || value === '1') {
            return {
                valid: true,
                value: true
            };
        }

        if (value === 0 || value === '0') {
            return {
                valid: true,
                value: false
            };
        }

        if (/^true$/i.test(value)) {
            return {
                valid: true,
                value: true
            };
        }

        if (/^false$/i.test(value)) {
            return {
                valid: true,
                value: false
            };
        }

        return {
            valid: false
        };
    }
};