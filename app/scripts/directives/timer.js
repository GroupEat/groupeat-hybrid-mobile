'use strict';

angular.module('groupeat.directives.timer', [

])

.directive('geTimer', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/directives/timer.html',
    scope: {
      endTime: '@',
      callbackTimer: '='
    }
  };
});
