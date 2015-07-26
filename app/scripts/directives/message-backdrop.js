'use strict';

angular.module('groupeat.directives.message-backdrop', [
  'ui.router',
  'pascalprecht.translate'
])

.directive('geMessageBackdrop', function ($rootScope, $state) {
  return {
    restrict: 'EA',
    templateUrl: 'templates/layouts/message-backdrop.html',
    scope: {
      status: '=',
      icon: '=',
      title: '=',
      details: '=',
      buttonText: '=',
      buttonSref: '='
    },
    link: function(scope) {
      scope.isLoading = function() {
        return scope.status === 'loading';
      };
      scope.isDisplayed = function() {
        return scope.status === 'displayed';
      };
      scope.buttonAction = function() {
        if(scope.buttonSref) {
          $state.go(scope.buttonSref);
        } else {
          $state.reload();
          $rootScope.$broadcast('$ionicView.afterEnter');
        }
      };
    }
  };
});
