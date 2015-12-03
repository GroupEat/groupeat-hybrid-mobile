var fs = require('fs');
var gulp = require('gulp');

var CORE_FILE_MIN = './bower_components/ionic-platform-web-client/dist/ionic.io.bundle.min.js';
var CONFIG_BACKUP = './.io-config.json';

var SETTINGS_REPLACE_START = "\\\"IONIC_SETTINGS_STRING_START\\\";";
var SETTINGS_REPLACE_END = "\\\"IONIC_SETTINGS_STRING_END\\\"";
var SETTINGS_REPLACEMENT = "return { get: function(setting) { if (settings[setting]) { return settings[setting]; } return null; } };";

function isCoreAvailable(callBack) {
  fs.exists(CORE_FILE_MIN, function(exists) {
    if (exists) {
      return callBack(true);
    } else {
      return callBack(false);
    }
  });
}

gulp.task('ionic-io', false, function(done) {
  isCoreAvailable(function(available){
    if(available){
      fs.readFile(CONFIG_BACKUP, function(err, data) {
        if(err){
          console.error('Could not read IO Config file .io-config.json. Did you create it?'.red);
          return done();
        } else {
          var jsonConfig = JSON.parse(data);
          fs.readFile(CORE_FILE_MIN, function(er, content) {
            var jsMinFile = String(content);
            var replacementString = "var settings = " + JSON.stringify(jsonConfig) + "; " + SETTINGS_REPLACEMENT;
            jsMinFile = jsMinFile.replace(new RegExp('(' + SETTINGS_REPLACE_START + ')(.*?)(' + SETTINGS_REPLACE_END + ')', 'g'), '$1' + replacementString + '$3')
            if (jsMinFile) {
              fs.writeFile(CORE_FILE_MIN, jsMinFile, function(e){
                if (e) {
                  console.error('Could not write ' + CORE_FILE_MIN + ' due to: ' + JSON.stringify(e));
                }
                return done();
              });
            } else {
              console.error('Unable to build the config factory'.red);
              return done();
            }
          });
        }
      });
    } else {
      console.log("Core Not available, try running bower install ?");
      return done();
    }
  });
});
