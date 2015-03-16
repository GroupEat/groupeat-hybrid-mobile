'use strict';

angular.module('groupeat.controllers.group-orders', [
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.popup',
  'groupeat.services.message-backdrop',
  'config',
  'ngGeolocation',
  'ngMaterial',
  'timer'
])

.controller('GroupOrdersCtrl', function($scope, $state, GroupOrder, MessageBackdrop, Network, Order, Popup, $geolocation, _) {

  $scope.groupOrders = {};
  $scope.isLoadingView = {
    value: true
  };
  
  $scope.onNewGroupOrder = function() {
    $state.go('restaurants');
  };

  $scope.onRefreshGroupOrders = function() {
    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      return;
    }

    $geolocation.getCurrentPosition()
    .then(function(currentPosition) {
      $scope.UserCurrentPosition = currentPosition;

      GroupOrder.get($scope.UserCurrentPosition.coords.latitude, $scope.UserCurrentPosition.coords.longitude)
      .then(function(response) {
        $scope.isLoadingView.value = false;
        $scope.groupOrders = response.data;
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
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    })
    .catch(function(error) {
      $scope.messageBackdrop = MessageBackdrop.noGeolocation();
      return;
    });

    
  };

  $scope.getTimeDiff = function (endingAt) {
    $scope.currentTime = new Date() ;
    var endingTime = new Date(endingAt.replace(/-/g, '/'));
    return Math.abs(endingTime - $scope.currentTime)/1000;
  };

  $scope.onJoinOrderTouch = function(groupOrder) {
		Order.setCurrentOrder(groupOrder.id, $scope.getTimeDiff(), groupOrder.discountRate);
		$state.go('restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
  };

  $scope.onRefreshGroupOrders();

});
