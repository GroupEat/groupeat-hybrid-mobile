'use strict';

angular.module('groupeat.directives.restaurant-card', []).directive('restaurantCard', function (Customer, GroupOrder, Order, Restaurant, $state) {
  return {
    restrict: 'EA',
    templateUrl: 'templates/cards/restaurant-card.html',
    scope: { data: '=' },
    link: function (scope) {
      scope.setArrayFromInt = function (num) {
        return new Array(num);
      };
      scope.onRestaurantTouch = function(restaurant) {
        Customer.checkActivatedAccount()
        .then(function() {
          return Customer.checkMissingInformation();
        }).then(function () {
          
        }).then(function (groupOrders) {
          return Restaurant.checkGroupOrders(restaurant.id, groupOrders);
        })
        .then(function() {
          Order.setCurrentOrder(null, null, 0, restaurant.deliveryCapacity, restaurant.discountPolicy);
          $state.go('restaurant-menu', {restaurantId: restaurant.id});
        });
      };
    }
  };
});