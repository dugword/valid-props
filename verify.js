'use strict';

function verifyPropertiesExist(params, schema) {
    var missingProperties = Object.keys(schema).filter(function (key) {
        return !params.hasOwnProperty([key]);
    });

    if (missingProperties.length) {
        var errorMsg = 'Missing properties: ' + missingProperties.join(', ');
        throw new Error(errorMsg);
    }
}

module.exports = {
    propertiesExist: verifyPropertiesExist
};