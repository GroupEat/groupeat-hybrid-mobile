'use strict';

angular.module('groupeat.services.ionic-user', [])

/*global Ionic:true*/
.factory('IonicUser', function () {

  Ionic.io();

  var user = Ionic.User.current();
  console.log(user.id);

  if (!user.id) {
      var anonymousId = Ionic.User.anonymousId();
      console.log('anonymousId', anonymousId);
      Ionic.User.load(anonymousId).then(function(){}, function() {
        user.id = anonymousId;
        user.save();
      });
  }

  var
  get = function(key, defaultValue) {
    return user.get(key, defaultValue);
  },

  set = function(dict) {
    for (var key in dict) {
      user.set(key, dict[key]);
    }
    user.save();
  },

  unset = function(key) {
    user.unset(key);
    user.save();
  };

  return {
    get: get,
    set: set,
    unset: unset
  };
});
