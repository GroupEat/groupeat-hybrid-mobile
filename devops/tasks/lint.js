var coffeelint = require('gulp-coffeelint');
var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('js-lint', function() {
  return gulp.src(['app/js/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('coffee-lint', function() {
  gulp.src('test/spec/**/*.coffee')
  .pipe(coffeelint(null, {
    'max_line_length': {level: "ignore"}
  }))
  .pipe(coffeelint.reporter('coffeelint-stylish'))
});

gulp.task('lint', ['js-lint', 'coffee-lint']);
