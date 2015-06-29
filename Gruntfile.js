// Generated on 2014-11-17 using generator-ionic 0.6.1
'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');

// OS Recognition added because windows is shit and works weirdly...
var os = require('os');
if ( os.platform() === 'win32')
{
  var spawn = require('win-spawn');
}
else
{
  var spawn = require('child_process').spawn;
}
module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  //Auto Js-fixer based on linting
  grunt.loadNpmTasks('grunt-fixmyjs');
  grunt.loadNpmTasks('grunt-webfont');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: 'app',
      scripts: 'scripts',
      styles: 'styles',
      images: 'images'
    },

    gitpull: {
      task: {
        options: {
        }
      }
    },

    fixmyjs: {
      options: {
        jshintrc: '.jshintrc',
        indentpref: 'spaces'
      },
      all: {
        files: [
          {expand: true, cwd: '<%= yeoman.app %>/<%= yeoman.scripts %>', src: ['**/*.js'], dest: '<%= yeoman.app %>/<%= yeoman.scripts %>', ext: '.js'}
        ]
      }
    },

    webfont: {
        icons: {
            src: '<%= yeoman.app %>/icons/*.svg',
            dest: '<%= yeoman.app %>/fonts/Groupeat',
            destCss: '<%= yeoman.app %>/styles/base/',
            options: {
                stylesheet: 'scss',
                htmlDemo: false,
                relativeFontPath: '../fonts',
                templateOptions: {
                  baseClass: 'gp-icon',
                  classPrefix: 'gp_',
                  mixinPrefix: 'gp-'
                }
            }
        }
    },

    // Environment Variables for Angular App
    // This creates an Angular Module that can be injected via ENV
    // Add any desired constants to the ENV objects below.
    // https://github.com/diegonetto/generator-ionic#environment-specific-configuration
    ngconstant: {
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'constants',
        dest: '<%= yeoman.app %>/scripts/constants.js'
      },
      development: {
        constants: {
          ENV: {
            name: 'development',
            apiEndpoint: 'http://groupeat.dev/api'
          }
        }
      },
      staging: {
        constants: {
          ENV: {
            name: 'staging',
            apiEndpoint: 'http://staging.groupeat.fr/api'
          }
        }
      },
      production: {
        constants: {
          ENV: {
            name: 'production',
            apiEndpoint: 'https://groupeat.fr/api'
          }
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'newer:copy:app']
      },
      html: {
        files: ['<%= yeoman.app %>/**/*.html'],
        tasks: ['newer:copy:app']
      },
      js: {
        files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'],
        tasks: ['newer:copy:app', 'newer:jshint:all']
      },
      coffee: {
        files: ['test/**/*.coffee'],
        tasks: ['newer:copy:app', 'newer:coffeelint:tests']
      },
      compass: {
        files: ['<%= yeoman.app %>/<%= yeoman.styles %>/**/*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer', 'newer:copy:tmp']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['ngconstant:development', 'newer:copy:app']
      },
      translations: {
        files: ['<%= yeoman.app %>/translations/*.json'],
        tasks: ['newer:copy:app']
      },
      data: {
        files: ['<%= yeoman.app %>/data/*.json'],
        tasks: ['newer:copy:app']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      dist: {
        options: {
          base: 'www'
        }
      },
      coverage: {
        options: {
          port: 9002,
          open: true,
          base: ['coverage/html']
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    coffeelint: {
      tests: {
        files: {
          src: ['test/**/*.coffee']
        },
        options: {
          'max_line_length': {
            'level': 'ignore'
          }
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'www/*',
            '!www/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/<%= yeoman.styles %>/',
          src: '{,*/}*.css',
          dest: '.tmp/<%= yeoman.styles %>/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}lib\//
      }
    },


    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/<%= yeoman.styles %>',
        cssDir: '.tmp/<%= yeoman.styles %>',
        generatedImagesDir: '.tmp/<%= yeoman.images %>/generated',
        imagesDir: '<%= yeoman.app %>/<%= yeoman.images %>',
        javascriptsDir: '<%= yeoman.app %>/<%= yeoman.scripts %>',
        fontsDir: '<%= yeoman.app %>/<%= yeoman.styles %>/fonts',
        importPath: '<%= yeoman.app %>/lib',
        httpImagesPath: '/<%= yeoman.images %>',
        httpGeneratedImagesPath: '/<%= yeoman.images %>/generated',
        httpFontsPath: '/<%= yeoman.styles %>/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: 'www/<%= yeoman.images %>/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },


    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: 'www',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on the useminPrepare configuration
    usemin: {
      html: ['www/**/*.html'],
      css: ['www/<%= yeoman.styles %>/**/*.css'],
      options: {
        assetsDirs: ['www']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= yeoman.app %>',
        noRebase: true
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: 'www',
          src: ['*.html', 'templates/**/*.html'],
          dest: 'www'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: 'www',
          src: [
            '<%= yeoman.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '*.html',
            'templates/**/*.html',
            'fonts/**/*',
            'translations/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/<%= yeoman.images %>',
          dest: 'www/<%= yeoman.images %>',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/<%= yeoman.styles %>',
        dest: '.tmp/<%= yeoman.styles %>/',
        src: '{,*/}*.css'
      },
      fonts: {
        expand: true,
        cwd: 'app/lib/ionic/release/fonts/',
        dest: '<%= yeoman.app %>/fonts/',
        src: '*'
      },
      vendor: {
        expand: true,
        cwd: '<%= yeoman.app %>/vendor',
        dest: '.tmp/<%= yeoman.styles %>/',
        src: '{,*/}*.css'
      },
      app: {
        expand: true,
        cwd: '<%= yeoman.app %>',
        dest: 'www/',
        src: [
          '**/*',
          '!**/*.(scss,sass,css)',
        ]
      },
      tmp: {
        expand: true,
        cwd: '.tmp',
        dest: 'www/',
        src: '**/*'
      }
    },

    concurrent: {
      ionic: {
        tasks: [],
        options: {
          logConcurrentOutput: true
        }
      },
      server: [
        'compass:server',
        'copy:styles',
        'copy:vendor',
        'copy:fonts'
      ],
      test: [
        'compass',
        'copy:styles',
        'copy:vendor',
        'copy:fonts'
      ],
      dist: [
        'compass:dist',
        'copy:styles',
        'copy:vendor',
        'copy:fonts'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       'www/<%= yeoman.styles %>/main.css': [
    //         '.tmp/<%= yeoman.styles %>/**/*.css',
    //         '<%= yeoman.app %>/<%= yeoman.styles %>/**/*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       'www/<%= yeoman.scripts %>/scripts.js': [
    //         'www/<%= yeoman.scripts %>/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    // These will override any config options in karma.conf.js if you create it.
    karma: {
      options: {
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised'],
        files: [
          '<%= yeoman.app %>/lib/angular/angular.js',
          '<%= yeoman.app %>/lib/angular-animate/angular-animate.js',
          '<%= yeoman.app %>/lib/angular-sanitize/angular-sanitize.js',
          '<%= yeoman.app %>/lib/angular-cookies/angular-cookies.js',
          '<%= yeoman.app %>/lib/angular-ui-router/release/angular-ui-router.js',
          '<%= yeoman.app %>/lib/angular-mocks/angular-mocks.js',
          '<%= yeoman.app %>/lib/angular-resource/angular-resource.min.js',
          '<%= yeoman.app %>/lib/angular-translate/angular-translate.js',
          '<%= yeoman.app %>/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
          '<%= yeoman.app %>/lib/angular-translate-storage-local/angular-translate-storage-local.js',
          '<%= yeoman.app %>/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
          '<%= yeoman.app %>/lib/angular-validation-match/dist/angular-input-match.min.js',
          '<%= yeoman.app %>/lib/angular-timer/dist/angular-timer.js',
          '<%= yeoman.app %>/lib/angular-material/angular-material.js',
          '<%= yeoman.app %>/lib/angular-auto-validate/dist/jcs-auto-validate.js',
          '<%= yeoman.app %>/lib/ngGeolocation/ngGeolocation.min.js',
          '<%= yeoman.app %>/lib/ngAutocomplete/src/ngAutocomplete.js',
          '<%= yeoman.app %>/lib/ionic/release/js/ionic.js',
          '<%= yeoman.app %>/lib/ionic/release/js/ionic-angular.js',
          '<%= yeoman.app %>/lib/lodash/lodash.min.js',
          '<%= yeoman.app %>/lib/sprintf/dist/sprintf.min.js',
          '<%= yeoman.app %>/lib/sprintf/dist/angular-sprintf.min.js',
          '<%= yeoman.app %>/lib/ngCordova/dist/ng-cordova.min.js',
          '<%= yeoman.app %>/lib/angular-material/angular-material.js',
          '<%= yeoman.app %>/lib/angular-material-icons/angular-material-icons.js',
          '<%= yeoman.app %>/lib/angular-messages/angular-messages.js',
          '<%= yeoman.app %>/lib/angular-aria/angular-aria.js',
          '<%= yeoman.app %>/lib/angular-permission/dist/angular-permission.js',
          '<%= yeoman.app %>/lib/angular-local-storage/dist/angular-local-storage.js',
          '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
          'app/templates/**/*.html',
          'test/utils/**/*.js',
          'test/spec/**/*.coffee'
        ],
        autoWatch: false,
        reporters: ['dots', 'coverage'],
        port: 8080,
        singleRun: false,
        preprocessors: {
          // Update this if you change the yeoman config path
          'app/templates/**/*.html': ['html2js'],
          'test/spec/**/*.coffee': ['coffee'],
          'app/scripts/**/*.js': ['coverage']
        },
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
            { type: 'html', dir: 'coverage/html', subdir: '.' },
            { type: 'lcov', dir: 'coverage/lcov', subdir: '.' },
            { type: 'text-summary' }
          ]
        }
      },
      unit: {
        // Change this to 'Chrome', 'Firefox', etc. Note that you will need
        // to install a karma launcher plugin for browsers other than Chrome.
        browsers: ['PhantomJS'],
        background: true
      },
      continuous: {
        browsers: ['PhantomJS'],
        singleRun: true,
      }
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/<%= yeoman.scripts %>',
          src: '*.js',
          dest: '.tmp/concat/<%= yeoman.scripts %>'
        }]
      }
    }

  });

  // Register tasks for all Cordova commands
  _.functions(cordovaCli).forEach(function (name) {
    grunt.registerTask(name, function () {
      this.args.unshift(name.replace('cordova:', ''));
      // Handle URL's being split up by Grunt because of `:` characters
      if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
        this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
      }
      var done = this.async();
      var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
      var cmd = path.resolve('./node_modules/cordova/bin', exec);
      var flags = process.argv.splice(3);
      var child = spawn(cmd, this.args.concat(flags));
      child.stdout.on('data', function (data) {
        grunt.log.writeln(data);
      });
      child.stderr.on('data', function (data) {
        grunt.log.error(data);
      });
      child.on('close', function (code) {
        code = code ? false : true;
        done(code);
      });
    });
  });

  // Since Apache Ripple serves assets directly out of their respective platform
  // directories, we watch all registered files and then copy all un-built assets
  // over to www/. Last step is running cordova prepare so we can refresh the ripple
  // browser tab to see the changes. Technically ripple runs `cordova prepare` on browser
  // refreshes, but at this time you would need to re-run the emulator to see changes.
  grunt.registerTask('ripple', ['wiredep', 'newer:copy:app', 'ripple-emulator']);
  grunt.registerTask('ripple-emulator', function () {
    grunt.config.set('watch', {
      all: {
        files: _.flatten(_.pluck(grunt.config.get('watch'), 'files')),
        tasks: ['newer:copy:app', 'prepare']
      }
    });

    var cmd = path.resolve('./node_modules/ripple-emulator/bin', 'ripple');
    var child = spawn(cmd, ['emulate']);
    child.stdout.on('data', function (data) {
      grunt.log.writeln(data);
    });
    child.stderr.on('data', function (data) {
      grunt.log.error(data);
    });
    process.on('exit', function (code) {
      child.kill('SIGINT');
      process.exit(code);
    });

    return grunt.task.run(['watch']);
  });

  // Dynamically configure `karma` target of `watch` task so that
  // we don't have to run the karma test server as part of `grunt serve`
  grunt.registerTask('watch:karma', function () {
    var karma = {
      files:
      ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
      'test/spec/**/*.js',
      'test/spec/**/*.coffee'],
      tasks: ['newer:coffeelint:tests', 'newer:jshint:test', 'karma:unit:run']
    };
    grunt.config.set('watch', karma);
    return grunt.task.run(['watch']);
  });

  // Wrap ionic-cli commands
  grunt.registerTask('ionic', function() {
    var done = this.async();
    var script = path.resolve('./node_modules/ionic/bin/', 'ionic');
    var flags = process.argv.splice(3);
    var child = spawn(script, this.args.concat(flags), { stdio: 'inherit' });
    child.on('close', function (code) {
      code = code ? false : true;
      done(code);
    });
  });

  grunt.registerTask('test', [
    'clean',
    'concurrent:test',
    'autoprefixer',
    'karma:unit:start',
    'watch:karma'
  ]);

  grunt.registerTask('serve', function () {
    var tasks = ['init'];
    var preparationTask = grunt.option('compress') ? 'compress' : 'expand';
    tasks.push(preparationTask);
    tasks.push('concurrent:ionic');
    grunt.config('concurrent.ionic.tasks', ['ionic:serve', 'watch']);
    grunt.task.run(tasks);
  });
  grunt.registerTask('emulate', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:emulate:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('run', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:run:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });

  grunt.registerTask('build', function() {
    var tasks = ['init'];
    var preparationTask = grunt.option('compress') ? 'compress' : 'expand';
    tasks.push(preparationTask);
    tasks.push('ionic:build:' + this.args.join());
    return grunt.task.run(tasks);
  });

  var env = grunt.option('env') || 'development';
  grunt.registerTask('init', [
    'clean',
    'ngconstant:' + env,
    'wiredep',
    'autoprefixer'
  ]);

  grunt.registerTask('expand', [
    'concurrent:server',
    'newer:copy:app',
    'newer:copy:tmp'
  ]);

  grunt.registerTask('fixAllJs', [
    'fixmyjs:all'
  ]);

  grunt.registerTask('generateFont', [
    'webfont'
  ]);

  grunt.registerTask('compress', [
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('coverage', ['karma:continuous', 'connect:coverage:keepalive']);

  grunt.registerTask('default', [
    'newer:jshint',
    'newer:coffeelint:tests',
    'karma:continuous',
    'init',
    'compress'
  ]);

  grunt.registerTask('pull', ['gitpull:task','npm-install']);

  grunt.registerTask('upload', function() {
    return grunt.task.run(['init', 'compress', 'ionic:upload' + this.args.join()]);
  });
};
