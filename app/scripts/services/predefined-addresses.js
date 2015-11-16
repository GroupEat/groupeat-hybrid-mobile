'use strict';

angular.module('groupeat.services.predefined-addresses', [
  'ngConstants',
  'ngResource'
])

.factory('PredefinedAddresses', function ($resource, $q, apiEndpoint) {
  var resource = $resource(apiEndpoint + '/predefinedAddresses');
  var get = function () {
    var defer = $q.defer();
    resource.get().$promise.then(function (response) {
      defer.resolve(response.data);
    }).catch(function () {
      defer.reject();
    });
    return defer.promise;
  };
  return { get: get };
});
