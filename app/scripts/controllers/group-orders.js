'use strict';

angular.module('groupeat.controllers.group-orders', [
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.popup',
  'groupeat.services.loading-backdrop',
  'groupeat.services.message-backdrop',
  'config',
  'ngGeolocation',
  'ngMaterial',
  'timer'
])

.controller('GroupOrdersCtrl', function($scope, $state, GroupOrder, LoadingBackdrop, MessageBackdrop, Network, Order, Popup, $geolocation, _) {

  $scope.groupOrders = {};


  $scope.onNewGroupOrder = function() {
    $state.go('restaurants');
  };

  $scope.onRefreshGroupOrders = function() {
    $scope.loadingBackdrop = LoadingBackdrop.barAndTabsBackdrop();
    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      $scope.$broadcast('scroll.refreshComplete');
      return;
    }
    $geolocation.getCurrentPosition()
    .then(function(currentPosition) {
      $scope.userCurrentPosition = currentPosition;
      GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude)
      .then(function(groupOrders) {
        LoadingBackdrop.noBackdrop();
        $scope.groupOrders = groupOrders;
        if (_.isEmpty($scope.groupOrders)) {
          $scope.messageBackdrop = {
            show: true,
            title: 'noGroupOrdersTitle',
            details: 'noGroupOrdersDetails',
            iconClasses: 'ion-ios-cart-outline',
            button: {
              text: 'newOrder',
              action: 'onNewGroupOrder()'
            }
          };
        }
        else {
          $scope.messageBackdrop = MessageBackdrop.noBackdrop();
        }
      })
      .catch(function() {
        $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshGroupOrders()');
      });
    })
    .catch(function() {
      $scope.messageBackdrop = MessageBackdrop.noGeolocation();
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.getTimeDiff = function (endingAt) {
    return Order.getTimeDiff(endingAt);
  };

  $scope.onJoinOrderTouch = function(groupOrder) {
		Order.setCurrentOrder(groupOrder.id, groupOrder.endingAt, groupOrder.discountRate);
		$state.go('restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
  };

  $scope.onRefreshGroupOrders();

});
