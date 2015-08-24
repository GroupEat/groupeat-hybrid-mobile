'use strict';

angular.module('groupeat.directives.restaurant-card', [
  'pascalprecht.translate'
])

.directive('geRestaurantCard', function () {

  return {
    restrict: 'EA',
    templateUrl: 'templates/cards/restaurant-card.html',
    scope: { data: '=' },
    link: function (scope) {
      scope.setArrayFromInt = function (num) {
        return new Array(num);
      };
    }
  };
});
