'use strict';

angular.module('groupeat.services.ionic-user', ['ngConstants'])

/*global Ionic:true*/
.factory('IonicUser', function (environment) {

  var
  shouldTrackUsers = function() {
    return environment === 'production';
  },

  init = function() {
    if (!user.id) {
        var anonymousId = Ionic.User.anonymousId();
        Ionic.User.load(anonymousId)
        .then(function(){}, function() {
          user.id = anonymousId;
          user.save();
        });
    }
  },

  get = function(key, defaultValue) {
    if (!shouldTrackUsers()) {
      return;
    }
    return user.get(key, defaultValue);
  },

  set = function(dict) {
    if (!shouldTrackUsers()) {
      return;
    }
    for (var key in dict) {
      user.set(key, dict[key]);
    }
    user.save();
  },

  unset = function(key) {
    if (!shouldTrackUsers()) {
      return;
    }
    user.unset(key);
    user.save();
  };

  if (shouldTrackUsers()) {
    Ionic.io();
    var user = Ionic.User.current();
    init();
  }

  return {
    get: get,
    set: set,
    unset: unset
  };
});
