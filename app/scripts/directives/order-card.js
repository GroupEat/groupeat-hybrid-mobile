'use strict';
angular.module('groupeat.directives.order-card', []).directive('orderCard', function (Customer, Order, $state) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/cards/order-card.html',
      scope: { order: '=' },
      link: function (scope) {
        console.log(Customer);
        scope.setArrayFromInt = function (num) {
          return new Array(num);
        };
        scope.onJoinOrderTouch = function (groupOrder) {
          Customer.checkActivatedAccount().then(function () {
            return Customer.checkMissingInformation();
          }).then(function () {
            Order.setCurrentOrder(groupOrder.id, groupOrder.endingAt, groupOrder.discountRate, groupOrder.remainingCapacity);
            $state.go('restaurant-menu', { restaurantId: groupOrder.restaurant.data.id });
          });
        };
      }
    };
  });