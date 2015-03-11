'use strict';

angular.module('groupeat.directives.message-backdrop', [])

.directive('geMessageBackdrop', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/message-backdrop.html'
  };
});
