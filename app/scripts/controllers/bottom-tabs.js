'use strict';

angular.module('groupeat.controllers.bottom-tabs', [])

.controller('BottomTabsCtrl', function($scope) {

  $scope.bottomTabs = [
    {
      'title'     : 'orders',
      'iconName'  : 'ion-fork',
      'stateTarget'    : 'group-orders'
    },
    {
      'title'     : 'settings',
      'iconName'  : 'ion-gear-a',
      'stateTarget'    : 'settings'
    }
  ];

});
