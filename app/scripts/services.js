'use strict';
angular.module('groupeat.services', [])

.factory('_', function() {
  return window._; // assumes underscore/lodash has already been loaded on the page
});
