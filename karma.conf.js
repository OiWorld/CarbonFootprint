module.exports = function(config) {
	config.set({
		browsers: [
			'PhantomJS'
		],
		frameworks: [
			'jasmine'
		],
		files: [
			'Source/core/CarbonFootprintCore.js',
			'Spec/**/*Spec.js'
		],
		reporters: [
			'mocha'
		],
		logLevel: config.LOG_WARN
	});
};