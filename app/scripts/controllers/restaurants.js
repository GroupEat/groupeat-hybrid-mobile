'use strict';

angular.module('groupeat.controllers.restaurants', [
  'groupeat.services.analytics',
  'groupeat.services.controller-promise-handler',
  'groupeat.services.customer',
  'groupeat.services.geolocation',
  'groupeat.services.lodash',
  'groupeat.services.group-order',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.restaurant',
])

.controller('RestaurantsCtrl', function(_, $q, $rootScope, $scope, $state, Analytics, ControllerPromiseHandler, Geolocation, GroupOrder, Customer, Network, Order, Restaurant) {

  Analytics.trackView('Restaurants');

  $scope.restaurants = [];

  $scope.onReload = function() {
    var promise = Network.hasConnectivity()
    .then(function() {
      return Geolocation.getGeolocation();
    })
    .then(function(currentPosition) {
      $scope.userCurrentPosition = currentPosition;
      return Restaurant.getFromCoordinates(currentPosition.coords.latitude, currentPosition.coords.longitude);
    })
    .then(function(restaurants) {
      if (_.isEmpty(restaurants)) {
        return $q.reject('noRestaurants');
      } else {
        $scope.restaurants = restaurants;
      }
    });
    ControllerPromiseHandler.handle(promise, $scope.initialState)
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.onRestaurantTouch = function(restaurant) {
    Customer.checkActivatedAccount()
    .then(function() {
      return Customer.checkMissingInformation();
    })
    .then(function () {
      return GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude);
    })
    .then(function (groupOrders) {
      return Restaurant.checkGroupOrders(restaurant.id, groupOrders);
    })
    .then(function() {
      Order.setCurrentOrder(null, null, 0, restaurant.deliveryCapacity, restaurant.discountPolicy);
      $state.go('app.restaurant-menu', {restaurantId: restaurant.id});
    });
  };

  $scope.$on('$ionicView.afterEnter', function() {
    $scope.initialState = $state.current.name;
    $scope.onReload();
  });

});
