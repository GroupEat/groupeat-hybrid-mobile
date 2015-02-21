'use strict';

angular.module('groupeat.controllers.group-orders', [
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.order',
  'config',
  'ngGeolocation',
  'ngMaterial',
  'timer'
])

.controller('GroupOrdersCtrl', function($scope, $state, GroupOrder, Order, $geolocation, _) {

  $scope.groupOrders = GroupOrder.get(function() {
    //console.log($scope.groupOrders);
    $scope.isGroupOrdersEmpty = false ;
    if (_.isEmpty($scope.groupOrders)) {
      $scope.isGroupOrdersEmpty = true ;
    }
  });



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
