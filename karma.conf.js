module.exports = function(config) {
	config.set({
		browsers: [
			'PhantomJS'
		],
		frameworks: [
			'jasmine'
		],
		files: [
			'Source/Core/core/CarbonFootprintCommon.js',
			'Source/Core/core/MapsCarbonFootprintCore.js',
			'Source/Core/core/validator/basicValidator.js',
			'Source/Core/core/validator/flightsValidator.js',
			'Source/Core/core/validator/mapsValidator.js',
			'Source/Core/core/validator/trainsValidator.js',
			'Spec/core/SentryServerMock.js',
			'Spec/**/*Spec.js'
		],
		reporters: [
			'mocha'
		],
		logLevel: config.LOG_WARN
	});
};
