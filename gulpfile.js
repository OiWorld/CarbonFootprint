var gulp = require('gulp');
var gjslint = require('gulp-gjslint');
var Server = require('karma').Server;
var stylish = require('jshint-stylish').reporter;

var lintFiles = ['Source/**/*.js', '!Source/**/*.min.js'];

gulp.task('karma', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('jslint', function () {
	return gulp.src(lintFiles)
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
});

gulp.task('gjslint', function() {
	return gulp.src(lintFiles)
	.pipe(gjslint())
	.pipe(gjslint.reporter('jshint', stylish))
});

gulp.task('test', ['gjslint', 'karma']);