'use strict';

angular.module('groupeat.controllers.group-orders', [
  'groupeat.services.analytics',
  'groupeat.services.controller-promise-handler',
  'groupeat.services.customer',
  'groupeat.services.customer-information-checker',
  'groupeat.services.geolocation',
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.order',
  'ionic',
  'timer'
])

.controller('GroupOrdersCtrl', function(_, $ionicPlatform, $rootScope, $scope, $state, $q, Analytics, ControllerPromiseHandler, Customer, CustomerInformationChecker, Geolocation, GroupOrder, Network, Order) {

  Analytics.trackView('Group Orders');

  $scope.groupOrders = [];

  $scope.onReload = function() {
    var promise = Network.hasConnectivity()
    .then(function() {
      return Geolocation.getGeolocation();
    })
    .then(function(currentPosition) {
      $scope.userCurrentPosition = currentPosition;
      return GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude);
    })
    .then(function(groupOrders) {
      $scope.groupOrders = groupOrders;
      if (_.isEmpty(groupOrders)) {
        return $q.reject('noGroupOrders');
      }
    });
    ControllerPromiseHandler.handle(promise, $scope.initialState)
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.onJoinOrderTouch = function(groupOrder) {
    Customer.checkActivatedAccount()
    .then(function() {
      return CustomerInformationChecker.check();
    })
    .then(function() {
      Order.setCurrentOrder(groupOrder.id, groupOrder.endingAt, groupOrder.discountRate, groupOrder.remainingCapacity, groupOrder.restaurant.data.discountPolicy, groupOrder.totalRawPrice);
	    $state.go('app.restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
    });
  };

  $scope.setArrayFromInt = function (num) {
    return new Array(num);
  };

  $scope.$on('$ionicView.afterEnter', function() {
    $scope.initialState = $state.current.name;
    $scope.onReload();
  });

  $ionicPlatform.on('resume', function() {
    $scope.initialState = $state.current.name;
    $scope.onReload();
  });

  $scope.callbackTimer = {};
  $scope.callbackTimer.finished = function() {
    $scope.onReload();
  };

});
