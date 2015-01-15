'use strict';

angular.module('groupeat.controllers.settings', ['groupeat.services.notifications-settings'])

.controller('SettingsCtrl', function($scope, $ionicModal, notificationsSettings) {

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

	$scope.user.settings = notificationsSettings.settings;

	$scope.settings = notificationsSettings.pivotTableSettings;

	// $scope.settings.dontPushAfter = [
	// 	{name: '21h00', id:0},
	// 	{name: '22h00', id:1},
	// 	{name: '23h00', id:2},
	// 	{name: '00h00', id:3},
	// 	{name: '1h00', id:4}
	// ];

	// $scope.settings.dontPushFor = [
	// 	{name: '1 jour', id:0},
	// 	{name: '2 jours', id:1},
	// 	{name: '3 jours', id:2},
	// 	{name: '4 jours', id:3},
	// 	{name: '5 jours', id:4},
	// 	{name: '6 jours', id:5},
	// 	{name: '1 semaine', id:6}
	// ];

	// Model declaration
	$scope.select = {};
	$scope.select.pushActivation = $scope.user.settings.pushActivation;
	$scope.select.dontPushAfter = $scope.settings.dontPushAfter[$scope.user.settings.dontPushAfter];
	$scope.select.dontPushFor = $scope.settings.dontPushFor[$scope.user.settings.dontPushFor];

	$scope.saveSettings = function() {
		//console.log(typeof $scope.select.pushActivation === "boolean");
		//console.log(typeof $scope.user.settings.dontPushFor );
		//console.log($scope.select.dontPushAfter);
		//console.log($scope.user.settings.dontPushFor < $scope.settings.dontPushFor.length);
		$scope.user.settings.pushActivation = $scope.select.pushActivation;
		$scope.user.settings.dontPushFor = $scope.select.dontPushFor.id;
		$scope.user.settings.dontPushAfter = $scope.select.dontPushAfter.id;
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
