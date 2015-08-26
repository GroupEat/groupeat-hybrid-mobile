'use strict';

angular.module('groupeat.directives.restaurant-card', [])

.directive('geRestaurantCard', function () {

  return {
    restrict: 'EA',
    templateUrl: 'templates/cards/restaurant-card.html',
    scope: { data: '=' },
    link: function (scope) {

      var rating = 2 * scope.data.rating;

      scope.setArrayFromInt = function (num) {
        return new Array(num);
      };

      scope.starClass = function(index) {
        console.log(rating/2);
        if (index < Math.floor(rating / 2)) {
          return 'icon ion-ios-star';
        } else if (index === Math.floor(rating / 2) && rating % 2 === 1){
          return 'icon ion-ios-star-half';
        }
        return 'icon ion-ios-star-outline';
      };

    }
  };
});
