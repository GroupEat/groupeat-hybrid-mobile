'use strict';

angular.module('groupeat.services.order', ['ngResource'])

.factory('Order', function($resource) {
  return $resource('data/orders.json');
});
