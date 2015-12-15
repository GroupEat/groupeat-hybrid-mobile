'use strict';

angular.module('groupeat.controllers.restaurants', [
  'groupeat.services.controller-promise-handler',
  'groupeat.services.customer',
  'groupeat.services.customer-information-checker',
  'groupeat.services.geolocation',
  'groupeat.services.lodash',
  'groupeat.services.group-order',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.restaurant',
])

.controller('RestaurantsCtrl', function(_, $q, $rootScope, $scope, $state, ControllerPromiseHandler, Geolocation, GroupOrder, Customer, CustomerInformationChecker, Network, Order, Restaurant) {

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
      return CustomerInformationChecker.check();
    })
    .then(function () {
      return GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude);
    })
    .then(function (groupOrders) {
      return Restaurant.checkGroupOrders(restaurant.id, groupOrders);
    })
    .then(function(existingGroupOrder) {
      if (existingGroupOrder) {
        Order.setCurrentOrder(existingGroupOrder.id, existingGroupOrder.endingAt, existingGroupOrder.discountRate, existingGroupOrder.remainingCapacity, existingGroupOrder.restaurant.data.discountPolicy, existingGroupOrder.totalRawPrice);
      }
      else {
        Order.setCurrentOrder(null, null, 0, restaurant.deliveryCapacity, restaurant.discountPolicy, 0, restaurant.closingAt);
      }
      $state.go('app.restaurant-menu', {restaurantId: restaurant.id});
    });
  };

  $scope.back = function() {
    $state.go('app.group-orders');
  };

  $scope.$on('$ionicView.afterEnter', function() {
    $scope.initialState = $state.current.name;
    $scope.onReload();
  });

});
