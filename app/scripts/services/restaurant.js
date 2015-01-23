'use strict';

angular.module('groupeat.services.restaurant', ['ngResource'])

.factory('Restaurant', function($resource, ENV) {
  return $resource(ENV.apiEndpoint+'/restaurants');
});
