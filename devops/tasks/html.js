var angularFilesort = require('gulp-angular-filesort');
var bowerFiles = require('main-bower-files');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var minifyCss = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

var argv = require('yargs')
.default('env', 'staging')
.describe('env', 'the environment to use')
.choices('env', ['development', 'staging', 'production'])
.boolean('compress')
.argv;

var compress = argv.compress || argv.env === 'production';

var uglifyJsCondition = function(file) {
  return compress && file.extname == '.js';
}

var uglifyCssCondition = function(file) {
  return compress && file.extname == '.css';
}

gulp.task('html', ['html:inject', 'html:useref']);

gulp.task('html:inject', ['fonts', 'js-lint'], function () {
  gulp.src('app/index.html')
  .pipe(inject(gulp.src(bowerFiles({includeDev: true}), {read: false}), {
    name: 'bower',
    relative: true
  }))
  .pipe(inject(
    gulp.src('app/**/*.js')
    .pipe(angularFilesort()),
    {relative: true}
  ))
  .pipe(gulp.dest('app'));
});

gulp.task('html:useref', ['html:inject'], function (done) {
  var target = gulp.src('app/index.html')
  .pipe(useref())
  .pipe(gulpif(uglifyJsCondition, ngAnnotate()))
  .pipe(gulpif(uglifyJsCondition, uglify()))
  .pipe(gulpif(uglifyCssCondition, minifyCss()))
  .pipe(gulp.dest('www'))
  .on('end', done);
});
