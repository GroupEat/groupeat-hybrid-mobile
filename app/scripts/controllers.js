'use strict';
angular.module('groupeat.controllers', [])

.controller('BottomTabsMenuController', function($scope, $state) {

	$scope.onCommandTap = function() {
		$state.go('current-command');
	};

	$scope.onSettingsTap = function() {
		$state.go('settings');
	};
})

.controller('CommandViewController', function($scope, $state) {

	$scope.shownGroup = null;

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
	settings list
	*/
	$scope.settings = [];
	for (var i=0; i<4; i++) {
		$scope.settings[i] = {
			name: i,
			items: []
		};

		$scope.groups[i].items.push('Réglage ' + i);
	}

	$scope.onNewCommandTap = function() {
		$state.go('food-choice');
	};

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

.controller('FirstPageViewController', function($scope, $state) {

	$scope.onAccessTap = function() {
		$state.go('current-command');
	};

})

.controller('GoogleLoginController', function($scope, $cordovaOauth) {

	$scope.googleLogin = function() {
		$cordovaOauth.google('CLIENT_ID_HERE', ['https://www.googleapis.com/auth/urlshortener', 'https://www.googleapis.com/auth/userinfo.email']).then(function(result) {
			console.log(JSON.stringify(result));
		}, function(error) {
			console.log(error);
		});
	};

});