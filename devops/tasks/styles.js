'use strict';

var autoprefixer = require('autoprefixer');
var gulp = require('gulp');
var mqpacker = require('css-mqpacker');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

var processors = [
    autoprefixer({browsers: ['last 2 versions']}),
    mqpacker
];

gulp.task('styles', ['fonts'], function() {
  gulp.src('app/styles/**/*.scss')
  .pipe(watch('app/styles/**/*.scss'))
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss(processors))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('www/styles/'));
});
