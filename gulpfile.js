var gulp = require('gulp'),
  gutil = require('gulp-util'),
  webserver = require('gulp-webserver'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  precss = require('precss'),
  cssnano = require('cssnano'),
  animation = require('postcss-animation'),
  magicAnimation = require('postcss-magic-animations'),
  colorFunction = require("postcss-color-function"),
//  grid = require('postcss-grid'),
  lost = require('lost');

var source = 'process/css/',
    dest = 'builds/',
    srcDest = 'builds/src/',
    srcSource = 'app/';

var react = require('gulp-react');
 
gulp.task('scripts', function () {
	return gulp.src(srcSource + 'template.jsx')
		.pipe(react())
		.pipe(gulp.dest(srcDest + 'js'));
});

gulp.task('html', function() {
  gulp.src(dest + '*.html');
});

gulp.task('css', function() {
  gulp.src(source + 'style.css')
  .pipe(postcss([
    precss(),
    animation(),
    colorFunction(),
//    magicAnimation(),
    lost(), // lost-grid
    autoprefixer(),
    cssnano()
  ]))
  .on('error', gutil.log)
  .pipe(gulp.dest(dest + 'css'));
});

gulp.task('watch', function() {
  gulp.watch(source + '**/*.css', ['css']);
  gulp.watch(dest + '**/*.html', ['html']);
  gulp.watch(['app/' + '**/*.js', '**/*.jsx'], ['scripts']);
});

gulp.task('webserver', function() {
  console.log(dest);
  gulp.src(dest)
    .pipe(webserver({
        open: true,
        livereload: true,
    }));
});

//gulp.task('webserver', function() {
//  console.log(dest);
//  gulp.src(dest)
//    .pipe(webserver({
//        port: 8090,
//        host: 'localhost',
//        open: true,
//        fallback:   'index.html',
//        livereload: true,
//        directoryListing: {
//            enable: true,
//            path: dest
//        }
//    }));
//});

gulp.task('default', ['scripts', 'html', 'css', 'webserver','watch']);
