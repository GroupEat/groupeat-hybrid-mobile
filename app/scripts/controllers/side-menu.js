'use strict';

angular.module('groupeat.controllers.side-menu', [
  'ionic',
])

.controller('SideMenuCtrl', function($scope) {
  $scope.menuItems = [
    {
      'title'     : 'orders',
      'iconClasses'  : 'ion-fork',
      'stateTarget'    : 'group-orders'
    },
    {
      'title'     : 'settings',
      'iconClasses'  : 'ion-gear-a',
      'stateTarget'    : 'settings'
    },
    {
      'title'     : 'order',
      'iconClasses'  : 'ion-clock',
      'stateTarget'     :'order' 
    }
  ];
});