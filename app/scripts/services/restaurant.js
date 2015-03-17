'use strict';

angular.module('groupeat.services.restaurant', [
  'config',
  'ngResource'
])

.factory('Restaurant', function($resource, $q, ENV) {

  var resource = $resource(ENV.apiEndpoint+'/restaurants?opened=1&around=1&latitude=:latitude&longitude=:longitude');

  var /**
  * @ngdoc function
  * @name Restaurant#get
  * @methodOf Restaurant
  *
  * @description
  * Returns a promise resolved with the list of currently opened restaurants if the server responds properly
  * Else the promise is rejected
  * https://groupeat.fr/docs
  *
  */
  get = function(latitude, longitude) {
    var defer = $q.defer();
    resource.get({latitude: latitude, longitude: longitude}).$promise
    .then(function(response) {
      defer.resolve(response.data);
    })
    .catch(function() {
      defer.reject();
    });
    return defer.promise;
  };

  return {
    get: get
  };
});
