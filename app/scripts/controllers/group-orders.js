'use strict';

angular.module('groupeat.controllers.group-orders', [
  'constants',
  'groupeat.services.analytics',
  'groupeat.services.customer',
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.popup',
  'groupeat.services.loading-backdrop',
  'groupeat.controllers.side-menu',
  'ngGeolocation',
  'ngMaterial',
  'timer'
])

.controller('GroupOrdersCtrl', function($filter, $scope, $state, $mdDialog, $q, $location, Analytics, Customer, LoadingBackdrop, GroupOrder, MessageBackdrop, Network, Order, Popup, $geolocation, _) {

  var $translate = $filter('translate');

  Analytics.trackView('Group Orders');

  $scope.groupOrders = {};

  $scope.onNewGroupOrder = function() {
    $state.go('restaurants');
  };

  $scope.initCtrl = function() {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop();
    $scope.onRefreshGroupOrders()
    .finally(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
    });
  };

  $scope.onRefreshGroupOrders = function() {
    var deferred = $q.defer();
    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      $scope.$broadcast('scroll.refreshComplete');
      deferred.reject();
    }
    else
    {
      $geolocation.getCurrentPosition()
      .then(function(currentPosition) {
        $scope.userCurrentPosition = currentPosition;
        GroupOrder.get($scope.userCurrentPosition.coords.latitude, $scope.userCurrentPosition.coords.longitude)
        .then(function(groupOrders) {
          deferred.resolve();
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
          return deferred.promise;
        })
        .catch(function() {
          deferred.reject();
          $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshGroupOrders()');
        });
      })
      .catch(function() {
        deferred.reject();
        $scope.messageBackdrop = MessageBackdrop.noGeolocation();
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    return deferred.promise;
  };

  $scope.getTimeDiff = function (endingAt) {
    return Order.getTimeDiff(endingAt);
  };

  $scope.onJoinOrderTouch = function(groupOrder) {
    // Checking if the customer has provided the needed further information before going further
    $scope.loadingBackdrop = LoadingBackdrop.backdrop();
    Customer.checkMissingInformation()
    .then(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
      Order.setCurrentOrder(groupOrder.id, groupOrder.endingAt, groupOrder.discountRate, groupOrder.remainingCapacity);
		  $state.go('restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
    })
    .catch(function(missingPropertiesString) {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
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
          $state.go('side-menu.settings');
        });
      }
    });
  };

  $scope.initCtrl();

});
