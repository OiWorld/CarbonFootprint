var gulp = require('gulp');
var gjslint = require('gulp-gjslint');
var Server = require('karma').Server;
var stylish = require('jshint-stylish').reporter;
var localizeForFirefox = require('chrome-to-firefox-translation');
var flatten = require('gulp-flatten');
var run = require('jpm/lib/run');
var xpi = require('jpm/lib/xpi');
var cmd = require('jpm/lib/cmd');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var gulpFilter = require('gulp-filter');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var del = require('delete-empty');
var runSequence = require('run-sequence');
var cheerio = require('gulp-cheerio');
var variables = require('./buildVariables.json');

var lintFiles = ['Source/**/*.js', '!Source/**/*.min.js', '!Source/Chrome/background/google-maps-api.js'];

var chormeBuildpath = 'Build/Chrome/';
var firefoxBuildpath = 'Build/Firefox/';
var safariBuildpath = 'Build/Safari/CarbonFootprint.safariextension/';
var doMinify = (argv.debug === undefined) ? true : false;

gulp.task('karma', function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('gjslint', function() {
	return gulp.src(lintFiles)
	  .pipe(gjslint())
	  .pipe(gjslint.reporter('jshint', stylish));
});

gulp.task('localesFF', function() {
	return gulp.src('Source/Locales/**/*.json')
	  .pipe(localizeForFirefox())
	  .pipe(flatten())
	  .pipe(gulp.dest(firefoxBuildpath + 'locale'));
});



gulp.task('coreFirefox', function() {
  var jsFilter = gulpFilter('**/*.js',{restore:true});
	var linkFilter = gulpFilter('**/knowMore.html', {restore:true});
	return gulp.src('Source/Core/**')
    .pipe(jsFilter)
    .pipe(gulpif(doMinify,stripDebug()))
    .pipe(gulpif(doMinify,uglify()))
    .pipe(jsFilter.restore)
	.pipe(linkFilter)
	.pipe(cheerio(function($, file){
		$('#rating-link')
			.attr('href', variables['firefox']['storeLink'])
			.html(`<i class="fa fa-external-link" aria-hidden="true"></i> ${variables['firefox']['storeName']}`);
		$('#store-link-1')
			.attr('href', variables['safari']['storeLink'])
			.html(`<img src="${variables['safari']['badge']}" class="img-responsive" />`);
		$('#store-link-2')
			.attr('href', variables['chrome']['storeLink'])
			.html(`<img src="${variables['chrome']['badge']}" class="img-responsive" />`);
	}))
	.pipe(linkFilter.restore)
	.pipe(gulp.dest(firefoxBuildpath + 'data'));
});

gulp.task('foldersFirefox', function() {
  var jsFilter = gulpFilter('**/*.js',{restore:true});
	return gulp.src('Source/Firefox/*/**')
    .pipe(jsFilter)
    .pipe(gulpif(doMinify,stripDebug()))
    .pipe(gulpif(doMinify,uglify()))
    .pipe(jsFilter.restore)
	  .pipe(gulp.dest(firefoxBuildpath + 'data'));
});

gulp.task('filesFirefox', function() {
  var jsFilter = gulpFilter('*.js',{restore:true});
	return gulp.src('Source/Firefox/*.*')
    .pipe(jsFilter)
    .pipe(gulpif(doMinify,stripDebug()))
    .pipe(gulpif(doMinify,uglify()))
    .pipe(jsFilter.restore)
	  .pipe(gulp.dest(firefoxBuildpath));
});

gulp.task('specificFirefox', ['foldersFirefox', 'filesFirefox']);

gulp.task('localesChrome', function() {
	return gulp.src('Source/Locales/**/*.json')
	  .pipe(gulp.dest(chormeBuildpath + '_locales'));
});

gulp.task('coreChrome', function() {
  var jsFilter = gulpFilter('**/*.js',{restore:true});
	var linkFilter = gulpFilter('**/knowMore.html', {restore:true});
  return gulp.src('Source/Core/**')
    .pipe(jsFilter)
    .pipe(gulpif(doMinify,stripDebug()))
    .pipe(gulpif(doMinify,uglify()))
    .pipe(jsFilter.restore)
	.pipe(linkFilter)
	.pipe(cheerio(function($, file){
		$('#rating-link')
			.attr('href', variables['chrome']['storeLink'])
			.html(`<i class="fa fa-external-link" aria-hidden="true"></i> ${variables['chrome']['storeName']}`);
		$('#store-link-1')
			.attr('href', variables['firefox']['storeLink'])
			.html(`<img src="${variables['firefox']['badge']}" class="img-responsive" />`);
		$('#store-link-2')
			.attr('href', variables['safari']['storeLink'])
			.html(`<img src="${variables['safari']['badge']}" class="img-responsive" />`);
	}))
	.pipe(linkFilter.restore)
	.pipe(gulp.dest(chormeBuildpath));
});

gulp.task('specificChrome', function() {
  var jsFilter = gulpFilter('**/*.js',{restore:true});
  return gulp.src('Source/Chrome/**')
    .pipe(jsFilter)
    .pipe(gulpif(doMinify,stripDebug()))
    .pipe(gulpif(doMinify,uglify()))
    .pipe(jsFilter.restore)
	  .pipe(gulp.dest(chormeBuildpath));
});
gulp.task('coreSafari', function() {
  var jsFilter = gulpFilter('**/*.js',{restore:true});
	var linkFilter = gulpFilter('**/knowMore.html', {restore:true});
	return gulp.src('Source/Core/**')
    .pipe(jsFilter)
    .pipe(gulpif(doMinify,stripDebug()))
    .pipe(gulpif(doMinify,uglify()))
    .pipe(jsFilter.restore)
	.pipe(linkFilter)
	.pipe(cheerio(function($, file){
		/*
		* TODO Safari is currently linked to https://safari-extensions.apple.com.
		* Update variables.json with appropriate link once app is published
		*/
		$('#rating-link')
			.attr('href', variables['safari']['storeLink'])
			.html(`<i class="fa fa-external-link" aria-hidden="true"></i> ${variables['safari']['storeName']}`);
		$('#store-link-1')
			.attr('href', variables['chrome']['storeLink'])
			.html(`<img src="${variables['chrome']['badge']}" class="img-responsive" />`);
		$('#store-link-2')
			.attr('href', variables['firefox']['storeLink'])
			.html(`<img src="${variables['firefox']['badge']}" class="img-responsive" />`);
	}))
	.pipe(linkFilter.restore)
	.pipe(gulp.dest(safariBuildpath));
});

gulp.task('chromeShared', function() {
  var jsFilter = gulpFilter('**/*.js',{restore:true});
	return gulp.src('Source/Chrome/background/**')
    .pipe(jsFilter)
    .pipe(gulpif(doMinify,stripDebug()))
    .pipe(gulpif(doMinify,uglify()))
    .pipe(jsFilter.restore)
	  .pipe(gulp.dest(safariBuildpath + 'background/'));
});

gulp.task('specificSafari', function() {
  var jsFilter = gulpFilter('**/*.js',{restore:true});
	return gulp.src('Source/Safari/**')
    .pipe(jsFilter)
    .pipe(gulpif(doMinify,stripDebug()))
    .pipe(gulpif(doMinify,uglify()))
    .pipe(jsFilter.restore)
	  .pipe(gulp.dest(safariBuildpath));
});

gulp.task('localesSafari', function() {
	return gulp.src('Source/Locales/**/*.json')
	  .pipe(gulp.dest(safariBuildpath + '_locales'));
});

gulp.task('clearXAttr', shell.task([
  'xattr -rc ' + safariBuildpath
]));

gulp.task('cleanChrome',function() {
  return del.sync(chormeBuildpath);
});

gulp.task('cleanSafari',function() {
  return del.sync(safariBuildpath);
});

gulp.task('cleanFirefox',function() {
  return del.sync(firefoxBuildpath);
});

gulp.task('groupFirefox', ['cleanFirefox','localesFF', 'coreFirefox', 'specificFirefox']);
gulp.task('groupChrome', ['cleanChrome','localesChrome', 'coreChrome', 'specificChrome']);
gulp.task('copySafariFiles', ['localesSafari', 'coreSafari', 'chromeShared','specificSafari']);

gulp.task('groupSafari', function(done) {
  runSequence('cleanSafari', 'copySafariFiles', 'clearXAttr', function() {
    done();
  });
});

gulp.task('group', ['groupChrome', 'groupFirefox', 'groupSafari']);

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

gulp.task('packageFirefox', ['groupFirefox'], function(done) {
	var dataObj = {
		addonDir: __dirname + '/' + firefoxBuildpath,
	};

	cmd.prepare('xpi', dataObj, function(mf) {
		xpi(mf, dataObj).then(null, console.error);
	})();

	done();
});

gulp.task('test', ['gjslint','karma']);
