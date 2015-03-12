'use strict';

angular.module('groupeat.services.restaurant', [
  'config',
  'ngResource',
  'groupeat.services.element-modifier'
])

.factory('Restaurant', function($resource, $q, ENV, ElementModifier) {
  var resource = $resource(ENV.apiEndpoint+'/restaurants?opened=true');

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
  get = function() {
    var defer = $q.defer();
    resource.get().$promise
    .then(function(response) {
      defer.resolve(response);
    })
    .catch(function(errorResponse) {
      defer.reject(ElementModifier.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  };

  return {
    get: get
  };
});
