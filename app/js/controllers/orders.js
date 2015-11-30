'use strict';

angular.module('groupeat.controllers.orders', [
  'groupeat.services.controller-promise-handler',
  'groupeat.services.credentials',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.order',
  'timer'
])

.controller('OrdersCtrl', function (_, $q, $rootScope, $scope, $state, $stateParams, ControllerPromiseHandler, Credentials, Network, Order) {

  $scope.onReload = function () {
    var promise = Network.hasConnectivity()
    .then(function() {
      return Order.queryForCustomer(Credentials.get().id);
    })
    .then(function(orders) {
      if (_.isEmpty(orders)) {
        return $q.reject('noOrders');
      } else {
        $scope.orders = orders;
      }
    });
    ControllerPromiseHandler.handle(promise, $scope.initialState)
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.getTimeDiff = function (endingAt) {
    return Order.getTimeDiff(endingAt);
  };

  $scope.$on('$ionicView.afterEnter', function() {
    $scope.initialState = $state.current.name;
    $scope.onReload();
  });

});
