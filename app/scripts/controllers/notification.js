'use strict';

angular.module('groupeat.controllers.notification', [
  'groupeat.services.device-assistant'
])

.controller('NotificationCtrl', function($rootScope, $scope) {


  $scope.hideModal = function() {
    if ($rootScope.notificationModal) {
      $rootScope.notificationModal.hide();
    }
  };

  $scope.message = function() {
    var message = 'Cannot reach notification message';
    if ($rootScope.notificationMessage) {
      message = $rootScope.notificationMessage;
    }
    return message;
  };

});
