'use strict';

angular.module('groupeat.controllers.restaurants', [
  'groupeat.services.analytics',
  'groupeat.services.customer',
  'groupeat.services.geolocation',
  'groupeat.services.lodash',
  'groupeat.services.loading-backdrop',
  'groupeat.services.group-order',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.restaurant',
])

.controller('RestaurantsCtrl', function($filter, $q, $scope, $state, Analytics, GroupOrder, Customer, LoadingBackdrop, MessageBackdrop, Network, Order, Restaurant, _, Geolocation) {

  Analytics.trackView('Restaurants');

  $scope.restaurants = [];

  $scope.initCtrl = function() {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop();
    $scope.onReload()
    .finally(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
    });
  };

  $scope.onRestaurantsListLeave = function() {
    $state.go('app.group-orders');
  };

  $scope.onReload = function() {
    var deferred = $q.defer();
    Network.hasConnectivity()
    .then(function() {
      return Geolocation.getGeolocation();
    })
    .then(function(currentPosition) {
      $scope.userCurrentPosition = currentPosition;
      return Restaurant.get(currentPosition.coords.latitude, currentPosition.coords.longitude);
    })
    .then(function(restaurants) {
      $scope.restaurants = restaurants;
      if (_.isEmpty(restaurants))
      {
        $scope.messageBackdrop = MessageBackdrop.backdrop('noRestaurants','ion-android-restaurant');
      }
      else
      {
        $scope.messageBackdrop = MessageBackdrop.noBackdrop();
      }
      deferred.resolve();
    })
    .catch(function(errorKey) {
      $scope.messageBackdrop = MessageBackdrop.backdropFromErrorKey(errorKey);
      deferred.reject();
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });

    return deferred.promise;
  };

  $scope.onRestaurantTouch = function(restaurant) {
    Customer.checkActivatedAccount()
    .then(function() {
      return Customer.checkMissingInformation();
    })
    .then(function() {
      return GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude);
    })
    .then(function(groupOrders) {
      return Restaurant.checkGroupOrders(restaurant.id, groupOrders);
    })
    .then(function() {
      Order.setCurrentOrder(null, null, 0, restaurant.deliveryCapacity, restaurant.discountPolicy);
      $state.go('restaurant-menu', {restaurantId: restaurant.id});
    });
  };

});
