'use strict';

angular.module('groupeat.controllers.settings', [])

.controller('SettingsCtrl', function($scope) {

	/*
	settings list
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
});
