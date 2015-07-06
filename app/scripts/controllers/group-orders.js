'use strict';

angular.module('groupeat.controllers.group-orders', [
  'groupeat.services.analytics',
  'groupeat.services.customer',
  'groupeat.services.geolocation',
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order',
  'timer'
])

.controller('GroupOrdersCtrl', function($scope, $state, $q, Analytics, Customer, GroupOrder, MessageBackdrop, Network, Order, Geolocation, _) {

  Analytics.trackView('Group Orders');

  $scope.groupOrders = [];

  $scope.onNewGroupOrder = function() {
    $state.go('restaurants');
  };

  $scope.onReload = function() {
    var deferred = $q.defer();
    Network.hasConnectivity()
    .then(function() {
      return Geolocation.getGeolocation();
    })
    .then(function(currentPosition) {
      $scope.userCurrentPosition = currentPosition;
      return GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude);
    })
    .then(function(groupOrders) {
      $scope.groupOrders = groupOrders;

      if (_.isEmpty($scope.groupOrders)) {
        $scope.messageBackdrop = MessageBackdrop.backdrop(
          'noGroupOrders',
          'ion-ios-cart-outline',
          'newOrder',
          'onNewGroupOrder()'
        );
      }
      else {
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


  $scope.onJoinOrderTouch = function(groupOrder) {
    Customer.checkActivatedAccount()
    .then(function() {
      return Customer.checkMissingInformation();
    })
    .then(function() {
      Order.setCurrentOrder(groupOrder.id, groupOrder.endingAt, groupOrder.discountRate, groupOrder.remainingCapacity, groupOrder.restaurant.data.discountPolicy, groupOrder.totalRawPrice);
	    $state.go('restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
    });
  };

  $scope.setArrayFromInt = function (num) {
    return new Array(num);
  };


});
