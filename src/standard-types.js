'use strict';

module.exports = {

    number: function (value) {
        value = parseFloat(value);

        if (isNaN(value)) {
            return null;
        }

        return value;
    },

    string: function (value) {
        if (value === undefined || value === null) {
            return null;
        }

        return value.toString();
    },

    date: function (value) {
        value = new Date(value);

        if (value.toString() === 'Invalid Date') {
            return null;
        }

        return value;
    },

    array: function (value) {
        if (!Array.isArray(value)) {
            return null;
        }

        // Reject empty arrays (Why would they pass that?)
        if (!value.length) {
            return null;
        }

        return value;
    },

    object: function (value) {
        if (typeof value !== 'object') {
            return null;
        }

        if (value === null) {
            return null;
        }

        // Reject empty objects
        if (!Object.keys(value).length) {
            return null;
        }

        return value;
    },

    boolean: function (value) {
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
    },
};
