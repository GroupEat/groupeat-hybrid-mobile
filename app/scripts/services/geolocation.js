'use strict';

angular.module('groupeat.services.geolocation', [
  'ngResource',
  'ngGeolocation'
])


.factory('Geolocation', function($q, ENV, $geolocation) {
  var getGeolocation = function() {
    var defer = $q.defer();
    if(ENV.name !== 'production') {
      var response = {'coords': {'latitude': 48.7107340, 'longitude': 2.2182329}};
      defer.resolve(response);
    }
    else {
      $geolocation.getCurrentPosition()
      .then(function(currentPosition) {
        defer.resolve(currentPosition);
      })
      .catch(function() {
        defer.reject();
      });
    }
    return defer.promise;
  };

  return {
    getGeolocation: getGeolocation
  };

});
