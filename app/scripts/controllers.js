'use strict';
angular.module('groupeat.controllers', [])

.controller('SideMenuController', function($scope, $ionicSideMenuDelegate, $state) {

  $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.onNavBarMenuButtonTap = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.onCommandTap = function() {
		$state.go('current-command');
		$ionicSideMenuDelegate.toggleLeft(false);
	};

	$scope.onSettingsTap = function() {
		$state.go('settings');
		$ionicSideMenuDelegate.toggleLeft(false);
	};

	$scope.onFavoritesTap = function() {
		$state.go('favorites');
		$ionicSideMenuDelegate.toggleLeft(false);
	};

})

.controller('CommandViewController', function($scope) {

  $scope.onNewCommandTap = function() {
		$state.go('food-choice');
	};

	/*
	accordion list
	*/
	$scope.groups = [];
	for (var i=0; i<10; i++) {
		$scope.groups[i] = {
			name: i,
			items: []
		};

		$scope.groups[i].items.push('infos sur le restaurant ' + i);

	}

	/*
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};

	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};

})
