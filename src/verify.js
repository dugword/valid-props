'use strict';

function verifyPropertiesExist(params, schema) {
    const missingProperties = Object.keys(schema).filter(function(key) {
        return !params.hasOwnProperty([key]);
    });

    if (missingProperties.length) {
        let errorMsg = 'Missing properties: ' + missingProperties.join(', ');
        throw new Error(errorMsg);
    }
}

module.exports = {
    propertiesExist: verifyPropertiesExist,
};
