var gulp = require('gulp');
var gjslint = require('gulp-gjslint');
var Server = require('karma').Server;
var stylish = require('jshint-stylish').reporter;
var localizeForFirefox = require('chrome-to-firefox-translation');
var flatten = require('gulp-flatten');
var run = require('jpm/lib/run');
var cmd = require('jpm/lib/cmd');
var argv = require('yargs').argv;

var lintFiles = ['Source/**/*.js', '!Source/**/*.min.js', '!Source/Chrome/background/google-maps-api.js'];

var chormeBuildpath = 'Build/Chrome/';
var firefoxBuildpath = 'Build/Firefox/';

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

gulp.task('localesFF', function() {
	return gulp.src('Source/Locales/**/*.json')
	.pipe(localizeForFirefox())
	.pipe(flatten())
	.pipe(gulp.dest(firefoxBuildpath + 'locale'))
});

gulp.task('coreFirefox', function() {
	return gulp.src('Source/Core/**')
	.pipe(gulp.dest(firefoxBuildpath + 'data'))
});

gulp.task('foldersFirefox', function() {
	return gulp.src('Source/Firefox/*/**')
	.pipe(gulp.dest(firefoxBuildpath + 'data'))
});

gulp.task('filesFirefox', function() {
	return gulp.src('Source/Firefox/*.*')
	.pipe(gulp.dest(firefoxBuildpath))
});

gulp.task('specificFirefox', ['foldersFirefox', 'filesFirefox']);

gulp.task('localesChrome', function() {
	return gulp.src('Source/Locales/**/*.json')
	.pipe(gulp.dest(chormeBuildpath + '_locales'))
});

gulp.task('coreChrome', function() {
	return gulp.src('Source/Core/**')
	.pipe(gulp.dest(chormeBuildpath))
});

gulp.task('specificChrome', function() {
	return gulp.src('Source/Chrome/**')
	.pipe(gulp.dest(chormeBuildpath))
});

gulp.task('groupFirefox', ['localesFF', 'coreFirefox', 'specificFirefox']);
gulp.task('groupChrome', ['localesChrome', 'coreChrome', 'specificChrome']);

gulp.task('group', ['groupChrome', 'groupFirefox']);

gulp.task('runFirefox', ['groupFirefox'], function(done) {

	if (!argv.b) {
		console.error('You need to specify the firefox binary with -b');
		return;
	}

	var dataObj = {
		addonDir: __dirname + '/' + firefoxBuildpath,
		binary: argv.b
	};

	cmd.prepare('run', dataObj, function(mf) {
		run(mf, dataObj).then(null, console.error);
	})();

	done();
});

gulp.task('test', ['gjslint']);