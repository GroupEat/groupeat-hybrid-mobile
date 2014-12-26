'use strict';

angular.module('groupeat.controllers.orders', ['groupeat.services.order'])

.controller('OrdersCtrl', function($scope, $state, Order) {

  $scope.orders = Order.query();

  $scope.onNewOrderTap = function() {
    $state.go('food-choice');
  };

});
