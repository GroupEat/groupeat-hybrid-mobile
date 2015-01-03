'use strict';

angular.module('groupeat.services.cart', ['ngResource'])

.factory('Cart', function($resource) {
  return $resource('data/cart.json');
});