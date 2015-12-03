var gulp = require('gulp');
var ngConstant = require('gulp-ng-constant');
var _ = require('lodash');
var argv = require('yargs')
.default('env', 'staging')
.describe('env', 'the environment to use')
.choices('env', ['development', 'staging', 'production'])
.argv;

var minimist = require('minimist');

gulp.task('constants', function () {

  var myConfig = require('./config.json');
  var envConfig = myConfig[argv.env];
  return ngConstant({
      constants: envConfig,
      stream: true,
      wrap: '"use strict";\n\n <%= __ngModule %>'
    })
    .pipe(gulp.dest('app/js'));
});
