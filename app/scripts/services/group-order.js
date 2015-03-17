'use strict';

angular.module('groupeat.services.group-order', ['groupeat.services.backend-utils'])

.factory('GroupOrder', function($resource, $q, ENV, BackendUtils) {

  var resource = $resource(ENV.apiEndpoint+'/groupOrders?joinable=1&around=1&latitude=:latitude&longitude=:longitude&include=restaurant');

  var /**
  * @ngdoc function
  * @name GroupOrder#get
  * @methodOf GroupOrder
  *
  * @description
  * Returns the list of current group orders
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
