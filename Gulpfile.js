/////////////////////////
/// /file Gulpfile.js
/// /version 0.1
/// /author Cyril POIDEVIN
///
/// Définitions du Gulpfile
/// 
/////////////////////////

// Plugins
// -------

// Global Plugins
var gulp = require("gulp")
var plumber = require("gulp-plumber")
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');

// Css/Sass Plugins
var sass = require("gulp-sass")
var csso = require("gulp-csso")
var cssbeautify = require('gulp-cssbeautify');
var csscomb = require('gulp-csscomb');

// JavaScript Plugins
var uglify = require('gulp-uglify');

// Pictures Plugins
var imagemin = require('gulp-imagemin');

// Development Tasks
// -----------------

// Start BrowserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: '.'
  });
});

// Watchers
gulp.task('watch', function(){
  gulp.watch("./sources/sass/**/*.scss", ["styles"]);
  gulp.watch("./sources/js/**/*.js", ["scripts"]);
  gulp.watch("./sources/picts/**/*.+(png|jpg|gif|svg)", ["picts"]);
  gulp.watch("./sources/fonts/**/*", ["fonts"]);
});

// Sass Compiler
gulp.task("styles", function(){
  gulp.src('./sources/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csscomb())
    .pipe(cssbeautify({indent: '  ', autosemicolon: true}))
    .pipe(gulp.dest('./assets/css/'))
    .pipe(browserSync.stream());
});

// Copying JS
gulp.task('scripts', function(){
  gulp.src('./sources/js/**/*.js')
    .pipe(plumber())
    .pipe(gulp.dest('./assets/js/'))
    .pipe(browserSync.stream());
});

// Optimization Tasks
// ------------------

// Minify Css
gulp.task('minify:styles', ['styles'], function () {
  return gulp.src(['./assets/css/*.css', '!./assets/css/*.min.css'])
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/css/'));
});

// Minify JS
gulp.task('minify:scripts', ['styles'], function () {
  return gulp.src(['./assets/js/*.js', '!./assets/js/*.min.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/js/'));
});

// Optimizing Pictures
gulp.task('picts', function(){
  return gulp.src('./sources/picts/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/picts/'));
});

// Copying Fonts
gulp.task('fonts', function(){
  return gulp.src('./sources/fonts/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/fonts/'));
});

// Cleaning
gulp.task('clean', function(callback){
  del('assets', callback);
});

gulp.task('clean:assets', function(callback){
  del(['assets', '!assets/picts', '!assets/picts/**/*'], callback);
});

// Build Sequences
// ---------------

// Default Task
gulp.task("default", function(callback) {
  runSequence(
    ["styles", "scripts", "picts", "fonts"], 
    ["browserSync", "watch"],
    callback
  );
});

// Build Task
gulp.task("build", function(callback) {
  runSequence('clean:dist',
    ['minify:css', 'minify:js', 'picts', 'fonts'], 
    callback
    )
});