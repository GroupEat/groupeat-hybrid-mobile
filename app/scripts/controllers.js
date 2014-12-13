'use strict';
angular.module('groupeat.controllers', [])

.controller('BottomTabsMenuController', function($scope, $state) {

	$scope.bottomTab = [
		{
			'title'     : 'Commandes',
			'iconName'  : 'ion-fork',
			'action'    : 'onCommandTap()'
		},
		{
			'title'     : 'Réglages',
			'iconName'  : 'ion-gear-a',
			'action'    : 'onSettingsTap()'
		}
	];

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
	for (var j=0; j<4; j++) {
		$scope.settings[j] = {
			name: j,
			items: []
		};

		$scope.groups[j].items.push('Réglage ' + j);
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

.controller('FirstPageViewController', function($scope, $state, $ionicPopup, $timeout, $ionicModal) {

	$ionicModal.fromTemplateUrl('templates/modal/login.html', {
		scope: $scope,
		animation: 'slide-in-up'
	})
	.then(function(modal) {
		$scope.loginModal = modal;
	});

	$scope.openLoginModal = function() {
		$scope.loginModal.show();
	};
	$scope.closeLoginModal = function() {
		$scope.loginModal.hide();
	};
	$scope.login = function() {
		$scope.loginModal.hide();
		$state.go('current-command');
	};

	$ionicModal.fromTemplateUrl('templates/modal/signup.html', {
		scope: $scope,
		animation: 'slide-in-up'
	})
	.then(function(modal) {
		$scope.signupModal = modal;
	});

	$scope.openSignupModal = function() {
		$scope.signupModal.show();
	};
	$scope.closeSignupModal = function() {
		$scope.signupModal.hide();
	};

});
