var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHtml = require('gulp-minify-html'),
	jsonminify = require('gulp-jsonminify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant');

var env = process.env.NODE_ENV || 'development',
	outputDir = 'builds/' + env + '/';

var coffeeSources = ['components/coffee/*.coffee'],
	coffeeDestination = 'components/scripts',
	jsSources = ['components/scripts/*.js'],
	jsDestination = outputDir + 'js',
	sassSources = ['components/sass/style.scss'],
	sassDestination = outputDir + 'css',
	htmlSources = ['builds/development/*.html'],
	jsonSources = ['builds/development/js/*.json'],
	imagesSources = ['builds/development/images/**/*.*'];

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
	gulp.watch(imagesSources, ['images']);
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
	.pipe(gulpif(env == 'production', jsonminify()))
	.pipe(gulpif(env == 'production', gulp.dest(outputDir + 'js')))
	.pipe(connect.reload());
});

gulp.task('images', function() {
	gulp.src(imagesSources)
	.pipe(gulpif(env == 'production', imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulpif(env == 'production', gulp.dest(outputDir + 'images')))
	.pipe(connect.reload());
});

gulp.task('default', ['html', 'json', 'images', 'coffee', 'js', 'compass', 'connect', 'watch']);
