// Karma configuration
// Generated on Mon Nov 09 2015 20:49:49 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised'],


    // list of files / patterns to load in the browser
    files: [
      //<!-- bower -->
      "../bower_components/angular/angular.js",
      "../bower_components/angular-animate/angular-animate.js",
      "../bower_components/angular-sanitize/angular-sanitize.js",
      "../bower_components/angular-ui-router/release/angular-ui-router.js",
      "../bower_components/lodash/lodash.js",
      "../bower_components/angular-translate/angular-translate.js",
      "../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
      "../bower_components/angular-cookies/angular-cookies.js",
      "../bower_components/angular-resource/angular-resource.js",
      "../bower_components/ngCordova/dist/ng-cordova.js",
      "../bower_components/angular-validation-match/dist/angular-input-match.min.js",
      "../bower_components/angular-auto-validate/dist/jcs-auto-validate.min.js",
      "../bower_components/sprintf/dist/sprintf.min.js",
      "../bower_components/sprintf/dist/angular-sprintf.min.js",
      "../bower_components/angular-local-storage/dist/angular-local-storage.js",
      "../bower_components/angular-messages/angular-messages.js",
      "../bower_components/momentjs/moment.js",
      "../bower_components/humanize-duration/humanize-duration.js",
      "../bower_components/angular-permission/dist/angular-permission.js",
      "../bower_components/ngAutocomplete/src/ngAutocomplete.js",
      "../bower_components/angular-ui-mask/dist/mask.js",
      "../bower_components/jquery/dist/jquery.js",
      "../bower_components/moment/moment.js",
      "../bower_components/ionic/release/js/ionic.js",
      "../bower_components/ionic/release/js/ionic-angular.js",
      "../bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js",
      "../bower_components/angular-timer/dist/angular-timer.js",
      "../bower_components/slick-carousel/slick/slick.min.js",
      "../bower_components/angular-moment/angular-moment.js",
      "../bower_components/angular-translate-storage-local/angular-translate-storage-local.js",
      "../bower_components/angular-slick-carousel/dist/angular-slick.js",
      //<!-- endbower -->
      "../bower_components/angular-mocks/angular-mocks.js",
      '../app/scripts/**/*.js',
      '../app/templates/**/*.html',
      'utils/**/*.js',
      'spec/**/*.coffee'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '../app/templates/**/*.html': ['html2js'],
      'spec/**/*.coffee': ['coffee'],
      '../app/scripts/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS2'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,

    coffeePreprocessor: {
      // options passed to the coffee compiler
      options: {
        bare: true,
        sourceMap: true
      },
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      stripPrefix: 'app/',
      cacheIdFromPath: function(filePath) {
        return filePath.match(/templates\/.*/)[0];
      }
    },

    coverageReporter: {
      reporters: [
      { type: 'html', dir: '../coverage/html', subdir: '.' },
      { type: 'lcov', dir: '../coverage/lcov', subdir: '.' },
      { type: 'text-summary' }
      ]
    }
  })
}
