'use strict';

angular.module('groupeat.controllers.group-orders', [
  'config',
  'groupeat.services.customer',
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.popup',
  'ngGeolocation',
  'ngMaterial',
  'timer'
])

.controller('GroupOrdersCtrl', function($filter, $scope, $state, $mdDialog, Customer, GroupOrder, MessageBackdrop, Network, Order, Popup, $geolocation, _) {

  var $translate = $filter('translate');

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
      $scope.$broadcast('scroll.refreshComplete');
      return;
    }
    $geolocation.getCurrentPosition()
    .then(function(currentPosition) {
      $scope.userCurrentPosition = currentPosition;
      GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude)
      .then(function(groupOrders) {
        $scope.isLoadingView.value = false;
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
    // Checking if the customer has provided the needed further information before going further
    Customer.checkMissingInformation()
    .then(function() {
      Order.setCurrentOrder(groupOrder.id, groupOrder.endingAt, groupOrder.discountRate);
		  $state.go('restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
    })
    .catch(function(missingPropertiesString) {
      if (!missingPropertiesString)
      {
        Popup.displayError($translate('genericFailureDetails'), 3000);
      }
      else
      {
        var confirm = $mdDialog.confirm({
          parent: angular.element(document.body)
        })
        .title($translate('missingPropertiesTitle'))
        .content($translate('missingCustomerInformationMessage', {missingProperties: missingPropertiesString}))
        .ok($translate('settings'))
        .cancel($translate('cancel'));
        $mdDialog.show(confirm)
        .then(function() {
          $state.go('settings');
        });
      }
    });
  };

  $scope.onRefreshGroupOrders();

});
