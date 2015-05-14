'use strict';

angular.module('groupeat.controllers.order', [
  'groupeat.services.analytics',
  'groupeat.services.loading-backdrop'
])

.controller('OrderCtrl', function($q, $scope, $state, $stateParams, Analytics, LoadingBackdrop) {

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
    deferred.resolve();
    return deferred.promise;
  };

  $scope.initCtrl();

});
