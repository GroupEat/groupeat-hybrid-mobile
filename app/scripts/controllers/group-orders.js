'use strict';

angular.module('groupeat.controllers.group-orders', [
  'groupeat.services.analytics',
  'groupeat.services.customer',
  'groupeat.services.geolocation',
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.order',
  'timer'
])

.controller('GroupOrdersCtrl', function(_, $rootScope, $scope, $state, $q, Analytics, Customer, Geolocation, GroupOrder, Network, Order) {

  Analytics.trackView('Group Orders');

  $scope.groupOrders = [];

  $scope.onReload = function() {
    Network.hasConnectivity()
    .then(function() {
      return Geolocation.getGeolocation();
    })
    .then(function(currentPosition) {
      $scope.userCurrentPosition = currentPosition;
      return GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude);
    })
    .then(function(groupOrders) {
      if (_.isEmpty(groupOrders)) {
        return $q.reject('noGroupOrders');
      } else {
        $scope.groupOrders = groupOrders;
      }
    })
    .then(function() {
      $rootScope.$broadcast('hideMessageBackdrop');
    })
    .catch(function(errorKey) {
      $rootScope.$broadcast('displayMessageBackdrop', errorKey);
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.onJoinOrderTouch = function(groupOrder) {
    Customer.checkActivatedAccount()
    .then(function() {
      return Customer.checkMissingInformation();
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
    $scope.onReload();
  });

});
