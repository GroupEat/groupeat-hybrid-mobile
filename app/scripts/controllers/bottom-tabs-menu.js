'use strict';

angular.module('groupeat.controllers.bottom-tabs-menu', [])

.controller('BottomTabsMenuCtrl', function($scope, $state) {

  $scope.bottomTabs = [
    {
      'title'     : 'orders',
      'iconName'  : 'ion-fork',
      'stateTarget'    : 'orders'
    },
    {
      'title'     : 'settings',
      'iconName'  : 'ion-gear-a',
      'stateTarget'    : 'settings'
    }
  ];

});
