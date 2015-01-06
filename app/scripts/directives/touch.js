'use strict';

angular.module('groupeat.directives.touch', [])

.directive('geTouch', function() {

  return function(scope, element, attrs) {

    element.bind('touchstart click', function(event) {

      event.preventDefault();
      event.stopPropagation();

      scope.$apply(attrs.geTouch);
    });
  };
});
