'use strict';

angular.module('groupeat.controllers.restaurants', [
  'groupeat.services.message-backdrop',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.restaurant',
  'ngGeolocation'
])

.controller('RestaurantsCtrl', function($scope, $state, Restaurant, MessageBackdrop, Network, _, $geolocation) {

  $scope.restaurants = {};

  $scope.onRefreshRestaurants = function() {
    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      return;
    }
    $geolocation.getCurrentPosition()
    .then(function(currentPosition) {
      $scope.UserCurrentPosition = currentPosition;
    })
    .then(function() {
      Restaurant.get($scope.UserCurrentPosition.coords.latitude, $scope.UserCurrentPosition.coords.longitude)
      .then(function(response) {
        $scope.restaurants = response.data;
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
    })
    .catch(function() {
      $scope.messageBackdrop = MessageBackdrop.noGeolocation();
      return;
    });
  };

  $scope.onRestaurantTouch = function(restaurantId) {
		$state.go('restaurant-menu', {restaurantId: restaurantId});
  };

  $scope.onRefreshRestaurants();

});
