'use strict';

angular.module('groupeat.directives.ge-hide-tabs', [])

.directive('geHideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope) {
      $rootScope.hideTabs = true;
      $scope.$on('$destroy', function() {
        $rootScope.hideTabs = false;
      });
    }
  };
});
