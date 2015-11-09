var gulp = require('gulp');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');

var copyFiles = [
  'app/fonts/**/*',
  'app/images/*',
  'app/scripts/**/*.js',
  'app/templates/**/*.html',
  'app/translations/*.json'
];

gulp.task('watch', function() {
  livereload.listen({ basePath: 'www' });
  gulp.watch(copyFiles, ['copy']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
});
