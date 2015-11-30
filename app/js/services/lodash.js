'use strict';
angular.module('groupeat.services.lodash', []).factory('_', function () {
  return window._;  // assumes underscore/lodash has already been loaded on the page
});