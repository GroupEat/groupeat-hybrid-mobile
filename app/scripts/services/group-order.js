'use strict';

angular.module('groupeat.services.group-order', ['ngResource'])

.factory('GroupOrder', function($resource, ENV) {
  return $resource(ENV.apiEndpoint+'/groupOrders?joinable=1&include=restaurant');
});
