var gulp = require('gulp');
var wiredep = require('wiredep');

gulp.task('bower', ['vendor-scripts', 'vendor-css'], function () {
  gulp.src('app/index.html')
    .pipe(wiredep.stream({
      fileTypes: {
        html: {
          replace: {
            js: function(filePath) {
              return '<script src="lib/' + filePath.split('/').pop() + '"></script>';
            },
            css: function(filePath) {
              return '<link rel="stylesheet" href="lib/' + filePath.split('/').pop() + '"/>';
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('www'));
});

gulp.task('vendor-scripts', function() {
  return gulp.src(wiredep().js)
    .pipe(gulp.dest('www/lib'));
});

gulp.task('vendor-css', function() {
  return gulp.src(wiredep().css)
    .pipe(gulp.dest('www/lib'));
});
