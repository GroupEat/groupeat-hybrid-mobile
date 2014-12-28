'use strict';

angular.module('groupeat.controllers.bottom-tabs-menu', [])

.controller('BottomTabsMenuCtrl', function($scope, $state) {

  $scope.bottomTabs = [
    {
      'title'     : 'orders',
      'iconName'  : 'ion-fork',
      'action'    : 'onOrdersTabTouch()'
    },
    {
      'title'     : 'settings',
      'iconName'  : 'ion-gear-a',
      'action'    : 'onSettingsTabTouch()'
    }
  ];

  $scope.onOrdersTabTouch = function() {
    $state.go('orders');
  };

  $scope.onSettingsTabTouch = function() {
    $state.go('settings');
  };
});
