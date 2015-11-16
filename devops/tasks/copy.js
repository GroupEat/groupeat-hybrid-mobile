var gulp = require('gulp');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');

var files = [
  'app/fonts/**/*',
  'app/images/*',
  'app/scripts/**/*.js',
  'app/index.html',
  'app/templates/**/*.html',
  'app/translations/*.json'
];

gulp.task('copy', ['js-lint'], function() {
  gulp.src(files, { "base" : "app" })
  .pipe(plumber())
  .pipe(gulp.dest('www'));
});
