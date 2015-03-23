'use strict';

angular.module('groupeat.controllers.settings', [
	'groupeat.services.address',
	'groupeat.services.credentials',
	'groupeat.services.customer',
	'groupeat.services.element-modifier',
	'groupeat.services.lodash',
	'groupeat.services.message-backdrop',
	'groupeat.services.network',
	'groupeat.services.notifications-settings',
	'groupeat.services.popup'
])

.controller('SettingsCtrl', function($filter, $scope, $state, _, Address, Credentials, Customer, ElementModifier, MessageBackdrop, Network, NotificationsSettings, Popup) {

	var $translate = $filter('translate');

	$scope.form = {};
	/*
	Settings list
	*/
	$scope.tabs = [
		{ title: 'editProfile', url: 'templates/settings/settings-profile.html' },
		{ title: 'pushSettings', url: 'templates/settings/settings-notifications.html' }
	];

	/*
	Loading
	*/
	$scope.onReload = function() {
		$scope.residencies = Address.getResidencies();
		if (!Network.hasConnectivity())
		{
			$scope.messageBackdrop = MessageBackdrop.noNetwork();
			return;
		}
		var customerId = Credentials.get().id;
		$scope.customer = {};
		Customer.get(customerId)
		.then(function(customer) {
			$scope.customer = customer;
			return Address.get(customerId);
		})
		.then(function(address) {
			var residencyInformation = Address.getResidencyInformationFromAddress(address);
			$scope.customer = _.merge($scope.customer, residencyInformation);
		})
		.catch(function() {
			$scope.messageBackdrop = MessageBackdrop.genericFailure();
		});
	};

	/*
	Saving
	*/
	$scope.onSave = function() {
		var customerId = Credentials.get().id;
		ElementModifier.validate($scope.form.customerEdit)
    .then(function() {
      var customerParams = _.pick($scope.customer, ['firstName', 'lastName', 'phoneNumber']);
      return Customer.update({id : customerId}, customerParams);
    })
    .then(function() {
      var addressParams = _.merge(Address.getAddressFromResidencyInformation($scope.customer.residency), {details: $scope.customer.details});
      return Address.update({id: customerId}, addressParams);
    })
    .then(function() {
			Popup.displayTitleOnly($translate('customerEdited'), 3000);
    })
    .catch(function(errorMessage) {
      Popup.displayError(errorMessage, 3000);
    });
	};

	$scope.settings = NotificationsSettings.pivotTableSettings;


	// Model declaration
	$scope.select = {};
	//$scope.user.settings = NotificationsSettings.settings;
	//$scope.select.pushActivation = $scope.user.settings.pushActivation;
	//$scope.select.dontPushAfter = $scope.settings.dontPushAfter[$scope.user.settings.dontPushAfter];
	//$scope.select.dontPushFor = $scope.settings.dontPushFor[$scope.user.settings.dontPushFor];

	$scope.saveSettings = function() {
		$scope.customer.settings.pushActivation = $scope.select.pushActivation;
		$scope.customer.settings.dontPushFor = $scope.select.dontPushFor.id;
		$scope.customer.settings.dontPushAfter = $scope.select.dontPushAfter.id;
		NotificationsSettings.saveSettings($scope.customer.settings);
		$state.go('settings');
	};

	$scope.onReload();

});
