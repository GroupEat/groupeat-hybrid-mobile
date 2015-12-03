var gulp = require('gulp');

gulp.task('dist', ['html', 'constants', 'ionic-io', 'copy', 'styles']);
