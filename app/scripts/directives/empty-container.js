'use strict';
angular.module('groupeat.directives.empty-container', []).directive('emptyContainer', [function (_) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/layouts/empty-container.html',
      scope: {
        data: '=',
        icon: '@',
        exclamation: '@',
        mainText: '@',
        actionText: '@',
        actionTap: '&'
      },
      link: function (scope) {
        scope._ = _;
      }
    };
  }]);