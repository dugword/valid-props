'use strict';

module.exports = {

    number: function (value) {
        value = parseFloat(value);

        if (isNaN(value)) {
            return {
                valid: false,
            };
        }

        return {
            valid: true,
            value: value,
        };
    },

    string: function (value) {
        if (value === undefined || value === null) {
            return {
                valid: false,
            };
        }

        return {
            valid: true,
            value: value.toString(),
        };
    },

    date: function (value) {
        value = new Date(value);

        if (value.toString() === 'Invalid Date') {
            return {
                valid: false,
            };
        }

        return {
            valid: true,
            value: value,
        };
    },

    array: function (value) {
        if (!Array.isArray(value)) {
            return {
                valid: false,
            };
        }

        // Reject empty arrays (Why would they pass that?)
        if (!value.length) {
            return {
                valid: false,
            };
        }

        return {
            valid: true,
            value: value,
        };
    },

    object: function (value) {
        if (typeof value !== 'object') {
            return {
                valid: false,
            };
        }

        if (value === null) {
            return {
                valid: false,
            };
        }

        // Reject empty objects
        if (!Object.keys(value).length) {
            return {
                valid: false,
            };
        }

        return {
            valid: true,
            value: value,
        };
    },

    boolean: function (value) {
        if (value === undefined || value === null) {
            return {
                valid: false,
            };
        }

        if (typeof value === 'boolean') {
            return {
                valid: true,
                value: value,
            };
        }

        if (value === 1 || value === '1') {
            return {
                valid: true,
                value: true,
            };
        }

        if (value === 0 || value === '0') {
            return {
                valid: true,
                value: false,
            };
        }

        if (/^true$/i.test(value)) {
            return {
                valid: true,
                value: true,
            };
        }

        if (/^false$/i.test(value)) {
            return {
                valid: true,
                value: false,
            };
        }

        return {
            valid: false,
        };
    },
};
