var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHtml = require('gulp-minify-html');

var env = process.env.NODE_ENV || 'development',
	outputDir = 'builds/' + env + '/';

var coffeeSources = ['components/coffee/*.coffee'],
	coffeeDestination = 'components/scripts',
	jsSources = ['components/scripts/*.js'],
	jsDestination = outputDir + 'js',
	sassSources = ['components/sass/style.scss'],
	sassDestination = outputDir + 'css',
	htmlSources = ['builds/development/*.html'],
	jsonSources = ['builds/development/js/*.json'];

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
	.pipe(coffee({
		bare: true
	}))
	.on('error', gutil.log)
	.pipe(gulp.dest(coffeeDestination));
});

gulp.task('js', function() {
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulpif(env == 'production', uglify()))
	.pipe(gulp.dest(jsDestination))
	.pipe(connect.reload());
});

gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(compass({
		sass: 'components/sass',
		image: 'builds/development/images',
		style: env == 'development' ? 'expanded' : 'compressed',
		comments: env == 'development'
	}))
	.on('error', gutil.log)
	.pipe(gulp.dest(sassDestination))
	.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src(htmlSources)
	.pipe(gulpif(env == 'production', minifyHtml()))
	.pipe(gulpif(env == 'production', gulp.dest(outputDir)))
	.pipe(connect.reload());
});

gulp.task('json', function() {
	gulp.src(jsonSources)
	.pipe(connect.reload());
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);