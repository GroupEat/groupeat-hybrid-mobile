'use strict';

angular.module('groupeat.services.group-order', ['ngResource'])

.factory('GroupOrder', function($resource, ENV) {
  return $resource(ENV.apiEndpoint+'/groupOrders?opened=true&include=restaurant');
});
