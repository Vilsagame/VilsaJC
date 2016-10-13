///////////////////////////////////////////////
/// /file Gulpfile.js
/// /version 0.1
/// /author Cyril POIDEVIN
///
/// Définitions du Gulpfile
///////////////////////////////////////////////

var gulp = require("gulp")
var sass = require("gulp-sass")

var gutil = require("gulp-util")
var plumber = require("gulp-plumber")
var cssnext = require("gulp-cssnext")
var csso = require("gulp-csso")
var options = require("minimist")(process.argv.slice(2))

gulp.task("styles", function(){
  gulp.src('./sources/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(!options.production ? plumber() : gutil.noop())
    .pipe(cssnext({sourcemap: !options.production}))
    .pipe(options.production ? csso() : gutil.noop())
    .pipe(gulp.dest('./assets/css/'))
})

gulp.task("default", ["styles"], function() {
  gulp.watch("./sass/**/*", ["styles"])
})