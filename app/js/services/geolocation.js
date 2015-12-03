'use strict';

angular.module('groupeat.services.geolocation', [
  'ngConstants',
  'ngCordova'
])

.factory('Geolocation', function ($q, $cordovaGeolocation, environment) {
  var getGeolocation = function () {
    var defer = $q.defer();
    if (environment !== 'production') {
      var response = {
        'coords': {
          'latitude': 48.710734,
          'longitude': 2.2182329
        }
      };
      defer.resolve(response);
    } else {
      document.addEventListener('deviceready', function() {
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function (currentPosition) {
          defer.resolve(currentPosition);
        }, function () {
          defer.reject('noGeolocation');
        });
      }, false);
    }
    return defer.promise;
  };
  return { getGeolocation: getGeolocation };
});
