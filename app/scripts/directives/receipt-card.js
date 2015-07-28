'use strict';

angular.module('groupeat.directives.receipt-card', []).directive('receiptCard', function () {
  return {
    restrict: 'EA',
    templateUrl: 'templates/cards/receipt-card.html',
    scope: {
      orders: '=',
      restaurant: '=',
      discount: '=',
      hideComment: '=?'
    },
    link: function (scope) {
      scope.setArrayFromInt = function (num) {
        return new Array(num);
      };
      console.log(scope.displayComment);
      scope.date = new Date();
      scope.$watch('discount', function() {
        scope.realPrice = scope.orders.getTotalPrice() * ( (100 - scope.discount ) / 100 );
      });
    }
  };
});
