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

.controller('FirstPageViewController', function($scope, $state, $ionicPopup, $timeout) {

	$scope.ShowLoginSignUpButtons = true ;

	$scope.onLoginTouch = function() {
		$scope.ShowLoginSignUpButtons = false;
		$scope.ShowLoginView = true ;
	};

	$scope.onAccessTouch = function() {
		$state.go('current-command');
	};

	$scope.showRestPasswordPopup = function() {
		$scope.user = {}; // data du user
		$scope.tapChoice = {} ; // quel choix fait sur la popup : cancel ou send ?


		$ionicPopup.show({
			title : '<h4 class="login-text-first-page border-less"> Reset Password </h4>' ,
			template: '<input type="email" ng-model="user.email">', // écrit ici pour empêcher une bar blanche ignoble
			templateUrl: 'templates/resetPasswordPopup.html',
			scope: $scope,
			buttons: [{
				text: 'Cancel',
				type: 'button-outline button-energized',
				onTap: function() {
					close();
					$scope.tapChoice = 'Cancel';
				}
			}, {
				text: 'Send',
				type: 'button-energized',
				onTap: function() {
					console.log($scope.user.email); // test console
					return $scope.user.email;
				}
			}]
		}).then(function() {
			if ($scope.tapChoice === 'Cancel') {} // la popup se ferme sans rien faire d'autre
				else {
				if($scope.user.email === undefined) { // alert : email invalid
					var alertInvalidEmail = $ionicPopup.alert({
						title: 'Invalid email.',
						okText: 'OK',
						okType: 'button-energized',
					});
					$timeout(function() {
					      alertInvalidEmail.close(); //close the popup after 2 seconds
							}, 1000);
				}

				else {
					var alertPopup = $ionicPopup.alert({ // info to user : email sent
						title: ' <i> Email sent to </i>' +  $scope.user.email  + '.',
						okText: 'OK',
						okType: 'button-energized',
					});
					$timeout(function() {
					      alertPopup.close(); //close the popup after 3 seconds
							}, 3000);
				}
			}
		});
	};

});
