'use strict';

angular.module('groupeat.services.customer', ['ngResource'])

.factory('Customer', function($resource, $localStorage) {
  return $resource($localStorage.get('devAPIPath')+'/customers');
});
