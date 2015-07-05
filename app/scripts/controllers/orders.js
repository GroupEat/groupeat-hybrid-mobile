'use strict';

angular.module('groupeat.controllers.orders', [
  'groupeat.services.credentials',
  'groupeat.services.lodash',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order',
  'timer'
])

.controller('OrdersCtrl', function (_, $q, $scope, $state, $stateParams, Credentials, MessageBackdrop, Network, Order) {

  $scope.onReload = function () {
    var deferred = $q.defer();
    Network.hasConnectivity()
    .then(function() {
      return Order.queryForCustomer(Credentials.get().id);
    })
    .then(function(orders) {
      $scope.orders = orders;
      if (_.isEmpty($scope.orders))
      {
        $scope.messageBackdrop = MessageBackdrop.backdrop('noOrders', 'ion-thumbsdown', 'reload', 'onReload()');
      }
      else
      {
        $scope.messageBackdrop = MessageBackdrop.noBackdrop();
      }
      deferred.resolve();
    })
    .catch(function(errorKey) {
      $scope.messageBackdrop = MessageBackdrop.backdropFromErrorKey(errorKey);
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

});
