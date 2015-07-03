'use strict';

angular.module('groupeat.directives.receipt-card', []).directive('receiptCard', function () {
  return {
    restrict: 'EA',
    templateUrl: 'templates/cards/receipt-card.html',
    scope: { data: '=' },
    link: function (scope) {
      scope.setArrayFromInt = function (num) {
        return new Array(num);
      };
    }
  };
});