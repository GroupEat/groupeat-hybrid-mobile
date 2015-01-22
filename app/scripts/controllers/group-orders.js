'use strict';

angular.module('groupeat.controllers.group-orders', ['groupeat.services.group-order', 'groupeat.services.order'])

.controller('GroupOrdersCtrl', function($scope, $state, GroupOrder, Order) {

  $scope.groupOrders = GroupOrder.query();

  $scope.onJoinOrderTouch = function(groupOrder) {
		Order.setCurrentOrder(groupOrder.groupOrderId, groupOrder.timeLeft, groupOrder.currentDiscount);
		$state.go('restaurant-menu', {restaurantId: Order.getCurrentOrder().groupOrderId});
  };

});
