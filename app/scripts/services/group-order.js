'use strict';

angular.module('groupeat.services.group-order', ['ngResource'])

.factory('GroupOrder', function($resource) {
  return $resource('data/group-orders.json');
});
