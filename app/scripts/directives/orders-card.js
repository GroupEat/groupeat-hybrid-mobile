'use strict';

angular.module('groupeat.directives.orders-card', []).directive('ordersCard', function () {
  return {
    restrict: 'EA',
    templateUrl: 'templates/cards/orders-card.html',
    scope: {
      order: '=',
    },
  };
});
