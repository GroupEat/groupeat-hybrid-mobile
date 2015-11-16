var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('serve', ['dist'], function() {
  gulp.src('www')
  .pipe(webserver({
    livereload: true,
    open: true
  }));
});
