'use strict';

angular.module('groupeat.services.group-order', [
  'config',
  'ngResource',
  'groupeat.services.element-modifier'
])

.factory('GroupOrder', function($resource, $q, ENV, ElementModifier) {

  var resource = $resource(ENV.apiEndpoint+'/groupOrders?joinable=1&include=restaurant');

  var /**
  * @ngdoc function
  * @name GroupOrder#query
  * @methodOf GroupOrder
  *
  * @description
  * Returns the list of current group orders
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
