var concat = require('gulp-concat');
var filter = require('gulp-filter');
var gulp = require('gulp');
var wiredep = require('wiredep');

gulp.task('vendor', ['vendor-css', 'vendor-js']);

gulp.task('vendor-css', function() {
  return gulp.src(wiredep().css)
  .pipe(filter('**/*.css'))
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('www/lib'));
});

gulp.task('vendor-js', function() {
  gulp.src(wiredep().js)
  .pipe(filter('**/*.js'))
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('www/lib'));
})
