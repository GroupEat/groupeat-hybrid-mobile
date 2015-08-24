'use strict';

angular.module('groupeat.services.restaurant', [
  'groupeat.services.backend-utils',
  'groupeat.services.lodash',
  'groupeat.services.popup'
])

.factory('Restaurant', function (_, Popup, $resource, $q, ENV) {

  var resource = $resource(ENV.apiEndpoint + '/restaurants/:id');
  var listResource = $resource(ENV.apiEndpoint + '/restaurants?opened=1&around=1&latitude=:latitude&longitude=:longitude');

  var
  /**
  * @ngdoc function
  * @name Restaurant#getFromCoordinates
  * @methodOf Restaurant
  *
  * @description
  * Returns a promise resolved with the list of currently opened restaurants if the server responds properly
  * Else the promise is rejected
  * https://groupeat.fr/docs
  *
  */
  getFromCoordinates = function (latitude, longitude) {
    var defer = $q.defer();
    listResource.get({latitude: latitude, longitude: longitude}).$promise
    .then(function (response) {
      defer.resolve(response.data);
    })
    .catch(function () {
      defer.reject();
    });
    return defer.promise;
  },

  /**
  * @ngdoc function
  * @name Restaurant#get
  * @methodOf Restaurant
  *
  * @description
  * Returns a promise resolved with the restaurant
  * Else the promise is rejected
  * https://groupeat.fr/docs
  *
  */
  get = function (restaurantId) {
    var defer = $q.defer();
    resource.get({id: restaurantId}).$promise
    .then(function (response) {
      defer.resolve(response.data);
    })
    .catch(function () {
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
      Popup.confirm('restaurantHasGroupOrder', 'restaurantHasGroupOrderMessage', 'ok!')
      .then(function(res) {
        if (res) {
          deferred.resolve();
        } else {
          deferred.reject();
        }
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  };

  return {
    checkGroupOrders: checkGroupOrders,
    get: get,
    getFromCoordinates : getFromCoordinates
  };
});
