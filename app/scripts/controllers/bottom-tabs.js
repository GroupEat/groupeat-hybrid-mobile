'use strict';

angular.module('groupeat.controllers.bottom-tabs', ['ionic'])

.controller('BottomTabsCtrl', function($scope) {

  $scope.bottomTabs = [
    {
      'title'     : 'orders',
      'iconClasses'  : 'ion-fork',
      'stateTarget'    : 'group-orders'
    },
    {
      'title'     : 'settings',
      'iconClasses'  : 'ion-gear-a',
      'stateTarget'    : 'settings'
    }
  ];

});
