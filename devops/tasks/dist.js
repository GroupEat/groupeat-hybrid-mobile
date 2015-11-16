var gulp = require('gulp');

gulp.task('dist', ['vendor', 'constants', 'copy', 'styles']);
