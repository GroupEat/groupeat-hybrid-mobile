'use strict';

angular.module('groupeat.controllers.group-orders', [
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.order',
  'groupeat.services.message-backdrop',
  'config',
  'ngGeolocation',
  'ngMaterial',
  'timer'
])

.controller('GroupOrdersCtrl', function($scope, $state, GroupOrder, MessageBackdrop, Order, $geolocation, _) {

  $scope.messageBackdrop = MessageBackdrop.noBackdrop();

  $scope.groupOrders = GroupOrder.get(function() {
    // console.log($scope.groupOrders);
    $scope.isGroupOrdersEmpty = false ;
    if (_.isEmpty($scope.groupOrders.data)) {
      $scope.isGroupOrdersEmpty = true ;
    }
  });

  $scope.refreshGroupOrders = function () {
    GroupOrder.get(function(groupOrders) {
      $scope.isGroupOrdersEmpty = false ;
      if (_.isEmpty($scope.groupOrders.data)) {
        $scope.isGroupOrdersEmpty = true ;
      }
      $scope.groupOrders = groupOrders ;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $geolocation.getCurrentPosition().then(function(currentPosition) {
		$scope.UserCurrentPosition = currentPosition;
  });

  $scope.$watch('UserCurrentPosition', function(){
  });


  $scope.getTimeDiff = function (endingAt) {
    $scope.currentTime = new Date() ;
    var endingTime = new Date(endingAt.date.replace(/-/g, '/'));
    return Math.abs(endingTime - $scope.currentTime)/1000;
  };

  $scope.onJoinOrderTouch = function(groupOrder) {
		Order.setCurrentOrder(groupOrder.id, $scope.getTimeDiff, groupOrder.discountRate);
		$state.go('restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
  };

});
