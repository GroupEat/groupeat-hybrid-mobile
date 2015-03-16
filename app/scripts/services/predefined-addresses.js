'use strict';

angular.module('groupeat.services.predefined-addresses', [
  'config',
  'ngResource'
])

.factory('PredefinedAddresses', function($resource, $q, ENV) {

  var resource = $resource(ENV.apiEndpoint+'/predefinedAddresses');

  var
  get = function() {
    var defer = $q.defer();
    resource.get().$promise
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
