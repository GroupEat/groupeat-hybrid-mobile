'use strict';

angular.module('groupeat.controllers.bottom-tabs-menu', [])

.controller('BottomTabsMenuCtrl', function($scope, $state) {

  $scope.bottomTab = [
    {
      'title'     : 'orders',
      'iconName'  : 'ion-fork',
      'action'    : 'onCommandTap()'
    },
    {
      'title'     : 'settings',
      'iconName'  : 'ion-gear-a',
      'action'    : 'onSettingsTap()'
    }
  ];

  $scope.onCommandTap = function() {
    $state.go('current-command');
  };

  $scope.onSettingsTap = function() {
    $state.go('settings');
  };
});
