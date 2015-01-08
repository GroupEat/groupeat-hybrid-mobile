'use strict';

angular.module('groupeat.controllers.group-orders', ['groupeat.services.group-order'])

.controller('GroupOrdersCtrl', function($scope, $state, GroupOrder) {

  $scope.groupOrders = GroupOrder.query();

});
