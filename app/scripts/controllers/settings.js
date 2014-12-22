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
	    { name: 'Editer mon profil', onTap: 'editProfile()', state:'food-choice'},
	    { name: 'Réglages des notifications', onTap: 'editNotifications()' , state:'food-choice'}
		];


});