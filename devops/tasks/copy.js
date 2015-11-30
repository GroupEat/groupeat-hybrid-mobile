var gulp = require('gulp');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');

var files = [
  'app/fonts/**/*',
  'app/hooks/**/*',
  'app/images/*',
  'app/templates/**/*.html',
  'app/translations/*.json'
];

gulp.task('copy', function() {
  gulp.src(files, { "base" : "app" })
  .pipe(plumber())
  .pipe(gulp.dest('www'));
});
