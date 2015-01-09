'use strict';

angular.module('groupeat.services.restaurant-menu', ['ngResource'])

.factory('Pizza', function($resource) {
  return $resource('data/pizzas/pizzas_restaurant_:restaurantId.json');
});
