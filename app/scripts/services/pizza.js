'use strict';

angular.module('groupeat.services.pizza', ['ngResource'])

.factory('Pizza', function($resource, ENV) {
  return $resource(ENV.apiEndpoint+'/restaurants/:restaurantId/products?include=formats');
});
