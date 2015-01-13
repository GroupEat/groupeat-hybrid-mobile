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

	$scope.user = {
		profile: {
			firstName:   'Phillipe',
			lastName:    'Fessier',
			phoneNumber: '0685958687',
			adress:      'Palaiseau',
		},
		settings: {
			pushActivation : true,
			dontPushAfter : 4,
			dontPushFor : 6,
		}
	};


	$scope.settings = {};

	$scope.settings.dontPushAfter = [
		{name: '21h00', id:0},
		{name: '22h00', id:1},
		{name: '23h00', id:2},
		{name: '00h00', id:3},
		{name: '1h00', id:4}
	];

	$scope.settings.dontPushFor = [
		{name: '1 jour', id:0},
		{name: '2 jours', id:1},
		{name: '3 jours', id:2},
		{name: '4 jours', id:3},
		{name: '5 jours', id:4},
		{name: '6 jours', id:5},
		{name: '1 semaine', id:6}
	];


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
