'use strict';

angular.module('groupeat.controllers.settings', [])

.controller('SettingsCtrl', function($scope, $ionicModal) {

	/*
	Settings list
	*/

	$scope.settingsList = [
	    { name: 'editProfile', state:'settings-profile'},
	    { name: 'pushSettings', state:'settings-notifications'}
		];

	$scope.user = {profile: {
		firstName:   'Phillipe',
		lastName:    'Fessier',
		phoneNumber: '0685958687',
		adress:      'Palaiseau',
	}};

	/*
	---------------- Profile Editing ----------------------------------
	*/

	$ionicModal.fromTemplateUrl('templates/modals/register.html', {
		scope: $scope,
		animation: 'slide-in-up'
	})
	.then(function(modal) {
		$scope.registerModal = modal;
	});

	$scope.openRegisterModal = function() {
		$scope.registerModal.show();
		$scope.userRegister = {};

	};
	$scope.closeRegisterModal = function() {
		$scope.registerModal.hide();
	};

});
