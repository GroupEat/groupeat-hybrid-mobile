'use strict';
angular.module('groupeat.services.restaurant', [
  'groupeat.services.backend-utils',
  'groupeat.services.lodash',
  'ngMaterial'
]).factory('Restaurant', function (_, $filter, $mdDialog, $resource, $q, ENV) {
  var $translate = $filter('translate');
  var resource = $resource(ENV.apiEndpoint + '/restaurants?opened=1&around=1&latitude=:latitude&longitude=:longitude');
  var
    /**
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
    get = function (latitude, longitude) {
      var defer = $q.defer();
      resource.get({
        latitude: latitude,
        longitude: longitude
      }).$promise.then(function (response) {
        defer.resolve(response.data);
      }).catch(function () {
        defer.reject();
      });
      return defer.promise;
    },
    /**
  * @ngdoc function
  * @name Customer#checkGroupOrders
  * @methodOf Customer
  * @param {integer} restaurantId
  * @param {array} groupOrders
  *
  * @description Returns a promise informing wether or not the customer has already activated his/her account
  */
    checkGroupOrders = function (restaurantId, groupOrders) {
      var deferred = $q.defer();
      if (_.some(groupOrders, 'restaurant.data.id', restaurantId)) {
        var confirm = $mdDialog.confirm({ parent: angular.element(document.body) }).title($translate('restaurantHasGroupOrderTitle')).content($translate('restaurantHasGroupOrderMessage')).ok($translate('join')).cancel($translate('cancel'));
        return $mdDialog.show(confirm);
      }
      deferred.resolve();
      return deferred.promise;
    };
  return {
    checkGroupOrders: checkGroupOrders,
    get: get
  };
});