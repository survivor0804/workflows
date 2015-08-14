var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass');

var coffeeSources = ['components/coffee/*.coffee'],
	coffeeDestination = 'components/scripts',
	jsSources = ['components/scripts/*.js'],
	jsDestination = 'builds/development/js',
	sassSources = ['components/sass/style.scss'],
	sassDestination = 'builds/development/css';

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
	.pipe(gulp.dest(jsDestination));
});

gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(compass({
		sass: 'components/sass',
		image: 'builds/development/images',
		style: 'expanded',
		comments: true
	}))
	.on('error', gutil.log)
	.pipe(gulp.dest(sassDestination));
});