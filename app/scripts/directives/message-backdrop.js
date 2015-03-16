'use strict';

angular.module('groupeat.directives.message-backdrop', [])

.directive('geMessageBackdrop', function($timeout) {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'templates/message-backdrop.html',
    link: function(scope) {
      scope.call = function(methodName) {
        $timeout(function() {
          scope.$apply(methodName);
        });
      };
    }
  };
});
