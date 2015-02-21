'use strict';

angular.module('groupeat.directives.hide-tabs', [])

.directive('geHideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope) {
      $rootScope.hideTabs = true;
      $scope.$on('$destroy', function() {
        $rootScope.hideTabs = false;
      });
      /* TODO : on cached --> hideTabs = false ; */
    }
  };
});
