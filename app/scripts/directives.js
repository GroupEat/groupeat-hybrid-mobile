'use strict';

var moduleDirective = angular.module('groupeat.directives', []);

moduleDirective.directive('hideTabs', function($rootScope) {
	return {
		restrict: 'A',
		link: function($scope) {
			$rootScope.hideTabs = true;
			$scope.$on('$destroy', function() {
				$rootScope.hideTabs = false;
			});
		}
	};
});

