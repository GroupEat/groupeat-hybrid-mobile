'use strict';

angular.module('groupeat.controllers.restaurants', [
  'groupeat.services.message-backdrop',
  'groupeat.services.lodash',
  'groupeat.services.loading-backdrop',
  'groupeat.services.network',
  'groupeat.services.restaurant',
  'ngGeolocation'
])

.controller('RestaurantsCtrl', function($scope, $state, Restaurant, LoadingBackdrop, MessageBackdrop, Network, _, $geolocation) {

  $scope.restaurants = {};

  $scope.initCtrl = function() {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop('with-bar-and-tabs');
    if (!Network.hasConnectivity())
    {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      $scope.$broadcast('scroll.refreshComplete');
      return;
    }
    $geolocation.getCurrentPosition()
    .then(function(currentPosition) {
      Restaurant.get(currentPosition.coords.latitude, currentPosition.coords.longitude)
      .then(function(restaurants) {
        $scope.restaurants = restaurants;
        $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
        if (_.isEmpty(restaurants))
        {
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
        else
        {
          $scope.messageBackdrop = MessageBackdrop.noBackdrop();
        }
      })
      .catch(function() {
        $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurants()');
      });
    })
    .catch(function() {
      $scope.messageBackdrop = MessageBackdrop.noGeolocation();
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.onRefreshRestaurants = function() {
    if (!Network.hasConnectivity())
    {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      $scope.$broadcast('scroll.refreshComplete');
      return;
    }
    $geolocation.getCurrentPosition()
    .then(function(currentPosition) {
      Restaurant.get(currentPosition.coords.latitude, currentPosition.coords.longitude)
      .then(function(restaurants) {
        $scope.restaurants = restaurants;
        if (_.isEmpty(restaurants))
        {
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
        else
        {
          $scope.messageBackdrop = MessageBackdrop.noBackdrop();
        }
      })
      .catch(function() {
        $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurants()');
      });
    })
    .catch(function() {
      $scope.messageBackdrop = MessageBackdrop.noGeolocation();
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.onRestaurantTouch = function(restaurantId) {
		$state.go('restaurant-menu', {restaurantId: restaurantId});
  };

  $scope.initCtrl();

});
