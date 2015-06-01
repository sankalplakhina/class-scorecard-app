// include gulp
var gulp = require('gulp');


// js related plug-ins
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

// css related plug-ins
var minifyCSS = require('gulp-minify-css');

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
    console.log('creating css...');
    gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css','src/css/app.css'])
    .pipe(concat('app.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css/'));
});


// JS concat, strip debugging and minify
gulp.task('scripts', function() {
    console.log('creating js..');
    gulp.src(['bower_components/jquery/dist/jquery.js', 'bower_components/bootstrap/dist/js/bootstrap.js', 'bower_components/angular/angular.js', 'bower_components/ngstorage/ngStorage.js', 'src/js/app.js'])
    .pipe(concat('app.min.js'))
    //    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});

// default gulp task
gulp.task('default', ['scripts', 'styles'], function() {

    // watch for JS changes
    gulp.watch('src/js/*.js', function() {
        gulp.run('scripts');
    });

    // watch for CSS changes
    gulp.watch('src/css/*.css', function() {
        gulp.run('styles');
    });
});