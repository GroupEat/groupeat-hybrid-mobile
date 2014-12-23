'use strict';

angular.module('groupeat.controllers.settings', [])

.controller('SettingsCtrl', function($scope, $state) {

	/*
	settings list
	*/

	$scope.editSetting = function(state) {
		$state.go(state);
	};

	$scope.settingsList = [
	    { name: 'editProfile', onTap: 'editProfile()', state:'food-choice'},
	    { name: 'pushSettings', onTap: 'editNotifications()' , state:'food-choice'}
		];


});
