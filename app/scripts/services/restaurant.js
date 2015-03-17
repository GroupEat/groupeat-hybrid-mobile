'use strict';

angular.module('groupeat.services.restaurant', ['groupeat.services.backend-utils'])

.factory('Restaurant', function($resource, $q, ENV, BackendUtils) {

  var resource = $resource(ENV.apiEndpoint+'/restaurants?opened=1&around=1&latitude=:latitude&longitude=:longitude');

  var /**
  * @ngdoc function
  * @name Restaurant#get
  * @methodOf Restaurant
  *
  * @description
  * Returns the list of currently opened restaurants
  * if rejected, an error message in proper locale will be rejected
  * https://groupeat.fr/docs
  *
  */
  get = function(latitude, longitude) {
    var defer = $q.defer();
    resource.get({latitude: latitude, longitude: longitude}).$promise
    .then(function(response) {
      defer.resolve(response.data);
    })
    .catch(function(errorResponse) {
      defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  };

  return {
    get: get
  };
});
