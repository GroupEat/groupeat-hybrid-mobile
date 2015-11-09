var gulp = require('gulp');
var ngConstant = require('gulp-ng-constant');
var _ = require('lodash');

var minimist = require('minimist');

gulp.task('constants', function () {
  var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
  };

  var options = minimist(process.argv.slice(2), knownOptions);

  if (options.env && _.includes(['development', 'staging', 'production'])) {
    env = options.env;
  } else {
    env = 'staging';
    console.error('Using staging environment (none or incorrect environment provided)');
  }

  var myConfig = require('./config.json');
  var envConfig = myConfig[env];
  return ngConstant({
      constants: envConfig,
      stream: true,
      wrap: '"use strict";\n\n <%= __ngModule %>'
    })
    .pipe(gulp.dest('app/scripts'));
});
