'use strict';

angular.module('groupeat.controllers.orders', [
  'groupeat.services.credentials',
  'groupeat.services.loading-backdrop',
  'groupeat.services.lodash',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order'
])

.controller('OrdersCtrl', function(_, $q, $scope, $state, $stateParams, Credentials, LoadingBackdrop, MessageBackdrop, Network, Order) {

  $scope.initCtrl = function() {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop('backdrop-get', 'with-bar-and-tabs');
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
      Order.queryForCustomer(Credentials.get().id)
      .then(function(orders) {
        deferred.resolve();
        $scope.orders = orders;
        $scope.messageBackdrop = MessageBackdrop.noBackdrop();
      })
      .catch(function(errorKey) {
        if (errorKey === 'notFound')
        {
          $scope.messageBackdrop = {
            show: true,
            title: 'noOrdersTitle',
            details: 'noOrdersDetails',
            iconClasses: 'ion-thumbsdown',
            button: {
              text: 'reload',
              action: 'onReload()'
            }
          };
        }
        else
        {
          $scope.messageBackdrop = MessageBackdrop.genericFailure();
        }
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
