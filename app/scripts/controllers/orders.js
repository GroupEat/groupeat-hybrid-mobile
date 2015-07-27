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
    var deferred = $q.defer();
    Network.hasConnectivity()
    .then(function() {
      return Order.queryForCustomer(Credentials.get().id);
    })
    .then(function(orders) {
      if (_.isEmpty($scope.orders)) {
        return $q.reject('noOrders');
      } else {
        $scope.orders = orders;
      }
    })
    .then(function() {
      $rootScope.$broadcast('hideMessageBackdrop');
      deferred.resolve();
    })
    .catch(function(errorKey) {
      $rootScope.$broadcast('displayMessageBackdrop', errorKey);
      deferred.reject();
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });

    return deferred.promise;
  };

  $scope.getTimeDiff = function (endingAt) {
    return Order.getTimeDiff(endingAt);
  };

  $scope.$on('$ionicView.afterEnter', function() {
    $scope.onReload();
  });

});
