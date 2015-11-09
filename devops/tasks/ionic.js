var gulp = require('gulp');
var shell = require('gulp-shell');

var argv = require('yargs')
.default('platform', 'ios')
.argv;

gulp.task('platform:add', shell.task(['ionic platform add ' + argv.platform]));
gulp.task('build', ['dist', 'platform:add'], shell.task(['ionic build ' + argv.platform]));
gulp.task('emulate', ['dist', 'platform:add'], shell.task(['ionic emulate ' + argv.platform]));
gulp.task('run', ['dist', 'platform:add'], shell.task(['ionic run --device ' + argv.platform]));
