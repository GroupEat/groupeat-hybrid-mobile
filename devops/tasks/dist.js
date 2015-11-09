var gulp = require('gulp');

gulp.task('dist', ['bower', 'constants', 'copy', 'styles']);
