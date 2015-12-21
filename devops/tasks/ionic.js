var gulp = require('gulp');
var shell = require('gulp-shell');

var argv = require('yargs')
.default('platform', 'ios')
.default('env', 'staging')
.describe('env', 'the environment to use')
.choices('env', ['development', 'staging', 'production'])
.argv;

var packageBuildCommand = 'ionic package build ' + argv.platform + ' --profile ' + argv.env;
if (argv.env === 'production') {
  packageBuildCommand += ' --release';
}
var packageDownloadCommand = 'mkdir -p dist && ionic package download ' + argv.id + ' -d dist';

gulp.task('platform:add', shell.task(['ionic platform add ' + argv.platform]));
gulp.task('build', ['dist', 'platform:add'], shell.task(['ionic build ' + argv.platform]));
gulp.task('emulate', ['dist', 'platform:add'], shell.task(['ionic emulate ' + argv.platform]));
gulp.task('run', ['dist', 'platform:add'], shell.task(['ionic run --device ' + argv.platform]));
gulp.task('package:build', ['dist'], shell.task([packageBuildCommand]));
gulp.task('package:list', shell.task(['ionic package list']));
gulp.task('package:info', shell.task(['ionic package info ' + argv.id]));
gulp.task('package:download', shell.task([packageDownloadCommand]));
