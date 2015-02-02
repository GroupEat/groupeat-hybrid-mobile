'use strict';

angular.module('groupeat.services.customer', ['ngResource', 'config'])

.factory('Customer', function($resource, ENV) {
  return $resource(ENV.apiEndpoint+'/customers');
});
