var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

var fontName = 'icons';
var runTimestamp = Math.round(Date.now()/1000);

gulp.task('fonts', function(){
  gulp.src(['app/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'app/styles/fonts/templates/_icons.scss',
      targetPath: '../../styles/fonts/_icons.scss',
      fontPath: '../fonts/Groupeat/',
      cssClass: 'gp'
    }))
    .pipe(iconfont({
      fontName: fontName,
      appendUnicode: true,
      timestamp: runTimestamp
     }))
    .pipe(gulp.dest('app/fonts/Groupeat/'));
});
