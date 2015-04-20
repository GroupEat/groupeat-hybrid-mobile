'use strict';

angular.module('groupeat.controllers.order', [
  'groupeat.services.analytics',
  'groupeat.services.loading-backdrop',
  'groupeat.services.lodash',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order'
])

.controller('OrderCtrl', function(_, $q, $scope, $state, $stateParams, Analytics, LoadingBackdrop, MessageBackdrop, Network, Order) {

  Analytics.trackEvent('Order', 'View', null, $stateParams.orderId);

  $scope.initCtrl = function() {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop();
    $scope.onReload()
    .finally(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
    });
  };

  $scope.onReload = function() {
    var deferred = $q.defer();
    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      $scope.$broadcast('scroll.refreshComplete');
      deferred.reject();
    }
    else
    {
      var orderId = 1;
      Order.get(orderId)
      .then(function(order) {
        deferred.resolve();
        $scope.order = order;
        $scope.messageBackdrop = MessageBackdrop.noBackdrop();
      })
      .catch(function() {
        $scope.messageBackdrop = MessageBackdrop.genericFailure();
        deferred.reject();
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    return deferred.promise;
  };

  $scope.initCtrl();

});
