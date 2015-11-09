var gulp = require('gulp');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');

var files = [
  'app/fonts/**/*',
  'app/images/*',
  'app/scripts/**/*.js',
  'app/templates/**/*.html',
  'app/translations/*.json'
];

gulp.task('copy', ['js-lint'], function() {
  gulp.src(files, { "base" : "app" })
  .pipe(watch(files))
  .pipe(plumber())
  .pipe(gulp.dest('www'));
});
