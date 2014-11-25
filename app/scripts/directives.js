'use strict';

angular.module('groupeat.directives', []);

module.directive('hideTabs', function($rootScope) {
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