'use strict';

angular.module('groupeat.controllers.restaurants', [
  'groupeat.services.message-backdrop',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.restaurant'
])

.controller('RestaurantsCtrl', function($scope, $state, Restaurant, MessageBackdrop, Network, _) {

  $scope.restaurants = {};

  $scope.onRefreshRestaurants = function() {
    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      return;
    }
    Restaurant.get()
    .then(function(restaurants) {
      $scope.restaurants = restaurants;
      if (_.isEmpty($scope.restaurants)) {
        $scope.messageBackdrop = {
          show: true,
          title: 'noRestaurantsTitle',
          details: 'noRestaurantsDetails',
          iconClasses: 'ion-android-restaurant',
          button: {
            text: 'reload',
            action: 'onRefreshRestaurants()'
          }
        };
      }
      else {
        $scope.messageBackdrop = MessageBackdrop.noBackdrop();
      }
    })
    .catch(function() {
      $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurants()');
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.onRestaurantTouch = function(restaurantId) {
		$state.go('restaurant-menu', {restaurantId: restaurantId});
  };

  $scope.onRefreshRestaurants();

});
