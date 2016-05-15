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
  lost = require('lost'),
  browserify = require('browserify'),
  react = require('gulp-react');

var source = 'process/css/',
    dest = 'builds/',
    srcDest = 'builds/src/',
    srcSource = 'app/';
 
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


gulp.task('default', ['scripts', 'html', 'css', 'webserver','watch']);


// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(isProduction) {
	scriptsCount++;
	// Browserify will bundle all our js files together in to one and will let
	// us use modules in the front end.
	var appBundler = browserify({
    	entries: './app/app.js',
    	debug: true
  	})

	// If it's not for production, a separate vendors.js file will be created
	// the first time gulp is run so that we don't have to rebundle things like
	// react everytime there's a change in the js file
  	if (!isProduction && scriptsCount === 1){
  		// create vendors.js for dev environment.
  		browserify({
			require: dependencies,
			debug: true
		})
			.bundle()
			.on('error', gutil.log)
			.pipe(source('vendors.js'))
			.pipe(gulp.dest('./web/js/'));
  	}
  	if (!isProduction){
  		// make the dependencies external so they dont get bundled by the 
		// app bundler. Dependencies are already bundled in vendor.js for
		// development environments.
  		dependencies.forEach(function(dep){
  			appBundler.external(dep);
  		})
  	}

  	appBundler
  		// transform ES6 and JSX to ES5 with babelify
	  	.transform("babelify", {presets: ["es2015", "react"]})
	    .bundle()
	    .on('error',gutil.log)
	    .pipe(source('bundle.js'))
	    .pipe(gulp.dest('./web/js/'));
}

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
