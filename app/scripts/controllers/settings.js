'use strict';

angular.module('groupeat.controllers.settings', ['groupeat.services.notifications-settings'])

.controller('SettingsCtrl', function($scope, $state, $ionicModal, NotificationsSettings) {

	/*
	Settings list
	*/

	$scope.settingsList = [
	    { name: 'editProfile', state:'settings-profile'},
	    { name: 'pushSettings', state:'settings-notifications'}
		];

	$scope.user = {
		profile: {
			firstName:   'Phillipe',
			lastName:    'Fessier',
			phoneNumber: '0685958687',
			adress:      'Palaiseau',
		}
	};
	
	$scope.user.settings = NotificationsSettings.settings;

	$scope.settings = NotificationsSettings.pivotTableSettings;


	// Model declaration
	$scope.select = {};
	$scope.select.pushActivation = $scope.user.settings.pushActivation;
	$scope.select.dontPushAfter = $scope.settings.dontPushAfter[$scope.user.settings.dontPushAfter];
	$scope.select.dontPushFor = $scope.settings.dontPushFor[$scope.user.settings.dontPushFor];

	$scope.saveSettings = function() {
		$scope.user.settings.pushActivation = $scope.select.pushActivation;
		$scope.user.settings.dontPushFor = $scope.select.dontPushFor.id;
		$scope.user.settings.dontPushAfter = $scope.select.dontPushAfter.id;
		NotificationsSettings.saveSettings($scope.user.settings);
		$state.go('settings');
	};

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
