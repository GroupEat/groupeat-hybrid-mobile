'use strict';

angular.module('groupeat.controllers.side-menu', [
  'ionic',
])

.controller('SideMenuCtrl', function($scope, $ionicSideMenuDelegate) {

  $scope.menuItems = [
    {
      'title': 'group-orders',
      'iconClasses': 'ion-fork',
      'stateTarget': 'group-orders'
    },
    {
      'title': 'orders',
      'iconClasses': 'ion-clock',
      'stateTarget': 'orders'
    },
    {
      'title': 'settings',
      'iconClasses': 'ion-gear-a',
      'stateTarget': 'settings'
    }
  ];

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

});
