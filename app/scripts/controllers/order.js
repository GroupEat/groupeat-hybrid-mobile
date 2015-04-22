'use strict';

angular.module('groupeat.controllers.order', [
  'groupeat.services.loading-backdrop'
])

.controller('OrderCtrl', function($q, $scope, $state, LoadingBackdrop) {

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
