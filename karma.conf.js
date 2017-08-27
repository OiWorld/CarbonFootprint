module.exports = function(config) {
	config.set({
		browsers: [
			'PhantomJS'
		],
		frameworks: [
			'jasmine'
		],
		files: [
			{pattern: 'Source/Core/core/resources/airplanes.json', included: false, served: true, watched: false, nocache: true},
			{pattern: 'Source/Core/core/resources/airports.json', included: false, served: true, watched: false, nocache: true},
			'Source/Core/core/CarbonFootprintCommon.js',
			'Source/Core/core/TrainsCarbonFootprintCore.js',
			'Source/Core/core/helpers/flightDataHelper.js',
			'Source/Core/core/FlightsFootprintCommon.js',
			'Source/Core/core/FlightsCarbonFootprintCore.js',
			'Source/Core/core/MapsCarbonFootprintCore.js',
			'Source/Core/core/validator/basicValidator.js',
			'Source/Core/core/validator/flightsValidator.js',
			'Source/Core/core/validator/mapsValidator.js',
			'Source/Core/core/validator/trainsValidator.js',
			'Source/Core/core/inform.js',
			'Spec/Mocks/SentryServerMock.js',
			'Spec/Mocks/MockHelper.js',
			'Spec/**/*Spec.js'
		],
		reporters: [
			'mocha'
		],
		logLevel: config.LOG_WARN
	});
};
