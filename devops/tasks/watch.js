var gulp = require('gulp');

var files = [
  'app/fonts/**/*',
  'app/images/*',
  'app/js/**/*.js',
  'app/styles/**/*.scss',
  'app/templates/**/*.html',
  'app/translations/*.json'
];

gulp.task('watch', ['serve'], function() {
  gulp.watch(files, ['dist']);
});
