'use strict';

angular.module('groupeat.services.predefined-addresses', ['ngResource'])

.factory('PredefinedAddresses', function($resource, ENV) {
  return $resource(ENV.apiEndpoint+'/predefinedAddresses');
});
