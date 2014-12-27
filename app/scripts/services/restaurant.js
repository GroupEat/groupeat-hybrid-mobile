'use strict';

angular.module('groupeat.services.restaurant', ['ngResource'])

.factory('Restaurant', function($resource) {
  return $resource('data/restaurants.json');
});
