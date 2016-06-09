var gulp = require('gulp');
var jshint = require('gulp-jshint');
var Server = require('karma').Server;


gulp.task('karma', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('lint', function (done) {
	return gulp.src([
		'Source/**/*.js',
		'!Source/**/*.min.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['lint', 'karma']);