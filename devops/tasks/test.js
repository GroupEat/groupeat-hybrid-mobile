var bowerFiles = require('main-bower-files');
var gulp = require('gulp');
var inject = require('gulp-inject');
var Server = require('karma').Server;

gulp.task('test:configure', function (done) {
  gulp.src('test/karma.conf.js')
  .pipe(inject(gulp.src(bowerFiles('**/*.js'), {read: false}), {
    starttag: '//<!-- bower -->',
    endtag: '//<!-- endbower -->',
    relative: true,
    transform: function (filepath, file, i, length) {
      return '"' + filepath + '",';
    }
  }))
  .pipe(gulp.dest('test'))
  .on('end', done);
});

/**
 * Run test once and exit
 */
gulp.task('test', ['ionic-io', 'test:configure'], function (done) {
  new Server({
    configFile: __dirname + '/../../test/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', ['test:configure'], function (done) {
  new Server({
    configFile: __dirname + '/../../test/karma.conf.js',
  }, done).start();
});
