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
  'groupeat.services.popup',
  'groupeat.services.restaurant',
  'ngMaterial'
])

.controller('RestaurantsCtrl', function($filter, $mdDialog, $q, $scope, $state, Analytics, GroupOrder, Customer, LoadingBackdrop, MessageBackdrop, Network, Order, Popup, Restaurant, _, Geolocation) {

  Analytics.trackView('Restaurants');

  $scope.restaurants = {};

  $scope.initCtrl = function() {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop();
    $scope.onRefreshRestaurants()
    .finally(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
    });
  };

  $scope.onRestaurantsListLeave = function() {
    $state.go('side-menu.group-orders');
  };

  $scope.onRefreshRestaurants = function() {
    var deferred = $q.defer();

    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      $scope.$broadcast('scroll.refreshComplete');
      deferred.reject();
    }
    else
    {
      Geolocation.getGeolocation()
      .then(function(currentPosition) {
        $scope.userCurrentPosition = currentPosition;
        Restaurant.get(currentPosition.coords.latitude, currentPosition.coords.longitude)
        .then(function(restaurants) {
          $scope.restaurants = restaurants;
          _.forEach($scope.restaurants, function(restaurant) {
            if(restaurant.logo === null || restaurant.logo === undefined) {
              restaurant.logo = 'images/flat-pizza.png';
            }
          });

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
          deferred.resolve();
        })
        .catch(function() {
          $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurants()');
          deferred.reject();
        });
      })
      .catch(function() {
        $scope.messageBackdrop = MessageBackdrop.noGeolocation();
        deferred.reject();
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    return deferred.promise;
  };

  $scope.onRestaurantTouch = function(restaurant) {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop();
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
      Order.setCurrentOrder(null, null, null, restaurant.deliveryCapacity);
      $state.go('restaurant-menu', {restaurantId: restaurant.id});
    })
    .finally(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
    });
  };

});
