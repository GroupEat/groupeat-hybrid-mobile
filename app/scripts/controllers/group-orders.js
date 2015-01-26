'use strict';

angular.module('groupeat.controllers.group-orders', ['groupeat.services.group-order', 'groupeat.services.order', 'timer', 'ngGeolocation'])

.controller('GroupOrdersCtrl', function($scope, $state, GroupOrder, Order, $geolocation) {

  $scope.groupOrders = GroupOrder.query();

  $geolocation.getCurrentPosition().then(function(currentPosition) {
		$scope.UserCurrentPosition = currentPosition;
  });

  $scope.$watch('UserCurrentPosition', function(){
  });
  

  $scope.onJoinOrderTouch = function(groupOrder) {
		Order.setCurrentOrder(groupOrder.groupOrderId, groupOrder.timeLeft, groupOrder.currentDiscount);
		$state.go('restaurant-menu', {restaurantId: Order.getCurrentOrder().groupOrderId});
  };

});
