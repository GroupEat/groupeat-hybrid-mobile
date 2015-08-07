'use strict';

angular.module('groupeat.controllers.orders', [
  'groupeat.services.credentials',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.order',
  'timer'
])

.controller('OrdersCtrl', function (_, $q, $rootScope, $scope, $state, $stateParams, Credentials, Network, Order) {

  $scope.onReload = function () {
    Network.hasConnectivity()
    .then(function() {
      return Order.queryForCustomer(Credentials.get().id);
    })
    .then(function(orders) {
      if (_.isEmpty(orders)) {
        return $q.reject('noOrders');
      } else {
        $scope.orders = orders;
      }
    })
    .then(function() {
      $rootScope.$broadcast('hideMessageBackdrop');
    })
    .catch(function(errorKey) {
      $rootScope.$broadcast('displayMessageBackdrop', errorKey);
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.getTimeDiff = function (endingAt) {
    return Order.getTimeDiff(endingAt);
  };

  $scope.$on('$ionicView.afterEnter', function() {
    $scope.onReload();
  });

});
