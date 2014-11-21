'use strict';

var self = module.exports;

var verbose = true;

self.validate = function (params, schema) {

	// Check that every required property exists
	var missingProperties = [];

	Object.keys(schema).forEach(function (requiredProperty) {
		if (!params[requiredProperty]) {
			return missingProperties.push(requiredProperty);
		}
	});

	if (missingProperties.length) {
		verbose && console.log('Missing properties:' + missingProperties.join(', '));
		return false;
	}

	// Check that every request is of the required type
	var incorrectTypes = [];

	Object.keys(schema).forEach(function (requiredProperty) {
		var type = schema[requiredProperty];

		if (type === 'date') {

		}	

		else if (type === 'array') {

		}

		else if (type === ) {

		}

		else if(typeof params[requiredProperty] !== schema[requiredProperty]) {
			return incorrectType.push((requiredProperty);
		}
	});

	// Strip params of unspecified properties
	
	cleanParams = {};

	Object.keys(schema).forEach(function (requiredProperty) {
		cleanParams[requiredProperty] = params[requiredProperty];
	});

	return cleanParams;
};
