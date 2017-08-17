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
			'Spec/**/*Spec.js'
		],
		reporters: [
			'mocha'
		],
		logLevel: config.LOG_WARN
	});
};
