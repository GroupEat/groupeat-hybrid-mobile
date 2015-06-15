'use strict';

angular.module('groupeat.controllers.group-orders', [
  'constants',
  'groupeat.services.analytics',
  'groupeat.services.customer',
  'groupeat.services.geolocation',
  'groupeat.services.group-order',
  'groupeat.services.lodash',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.popup',
  'groupeat.services.loading-backdrop',
  'groupeat.controllers.side-menu',
  'ngMaterial',
  'timer'
])


.controller('GroupOrdersCtrl', function($scope, $state, $mdDialog, $q, $location, Analytics, Customer, LoadingBackdrop, GroupOrder, MessageBackdrop, Network, Order, Popup, Geolocation, _) {

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
      Geolocation.getGeolocation()
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
    $scope.loadingBackdrop = LoadingBackdrop.backdrop();
    Customer.checkActivatedAccount()
    .then(function() {
      return Customer.checkMissingInformation();
    })
    .then(function() {
      Order.setCurrentOrder(groupOrder.id, groupOrder.endingAt, groupOrder.discountRate, groupOrder.remainingCapacity);
	    $state.go('restaurant-menu', {restaurantId: groupOrder.restaurant.data.id});
    })
    .finally(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
    });
  };
});
