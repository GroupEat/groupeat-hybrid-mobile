'use strict';

angular.module('groupeat.directives.loading-backdrop', [])

.directive('geLoadingBackdrop', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'templates/loading-backdrop.html',
    link: function() {
    }
  };
});
