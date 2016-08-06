var gulp = require('gulp');
var gjslint = require('gulp-gjslint');
var Server = require('karma').Server;
var stylish = require('jshint-stylish').reporter;
var localizeForFirefox = require('chrome-to-firefox-translation');
var flatten = require('gulp-flatten');

var lintFiles = ['Source/**/*.js', '!Source/**/*.min.js', '!Source/background/google-maps-api.js'];

gulp.task('karma', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('gjslint', function() {
	return gulp.src(lintFiles)
	.pipe(gjslint())
	.pipe(gjslint.reporter('jshint', stylish))
});

gulp.task('localize', function() {
	return gulp.src('Source/_locales/**/*.json')
	.pipe(localizeForFirefox())
	.pipe(flatten())
	.pipe(gulp.dest('localesFF'))
})

gulp.task('test', ['gjslint', 'karma']);