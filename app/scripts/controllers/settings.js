'use strict';

angular.module('groupeat.controllers.settings', [
	'groupeat.services.address',
	'groupeat.services.authentication',
	'groupeat.services.credentials',
	'groupeat.services.customer',
	'groupeat.services.customer-settings',
	'groupeat.services.element-modifier',
	'groupeat.services.lodash',
	'groupeat.services.loading-backdrop',
	'groupeat.services.message-backdrop',
	'groupeat.services.network',
	'groupeat.services.popup',
	'jcs-autoValidate'
])

.controller('SettingsCtrl', function($filter, $q, $scope, $state, _, Address, Authentication, Credentials, Customer, CustomerSettings, ElementModifier, LoadingBackdrop, MessageBackdrop, Network, Popup) {

	var $translate = $filter('translate');

	/*
	Models
	*/
	$scope.customer = {};
	$scope.form = {};
	$scope.customerSettings = {};

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
		$scope.loadingBackdrop = LoadingBackdrop.backdrop();

		// Loading notification related options
		$scope.daysWithoutNotifyingOptions = CustomerSettings.getDaysWithoutNotifying();
		$scope.noNotificationAfterOptions = CustomerSettings.getNoNotificationAfterHours();
		$scope.residencies = Address.getResidencies();

		if (!Network.hasConnectivity())
		{
			$scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
			$scope.messageBackdrop = MessageBackdrop.noNetwork();
			return;
		}
		var customerId = Credentials.get().id;
		Customer.get(customerId)
		.then(function(customer) {
			$scope.customer = customer;
			return Address.get(customerId);
		})
		.then(function(address) {
			$scope.customer = _.merge($scope.customer, address);
			return CustomerSettings.get(customerId);
		})
		.then(function(customerSettings) {
			$scope.customerSettings = _.pick(customerSettings, ['notificationsEnabled', 'daysWithoutNotifying']);
			$scope.customerSettings.noNotificationAfter = _.find($scope.noNotificationAfterOptions, function(option) {
				return (option.value === customerSettings.noNotificationAfter);
			});
			$scope.messageBackdrop = MessageBackdrop.noBackdrop();
		})
		.catch(function() {
			$scope.messageBackdrop = MessageBackdrop.genericFailure();
		})
		.finally(function() {
			$scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
		});
	};

	/*
	Saving
	*/
	$scope.onSave = function() {
		$scope.loadingBackdrop = LoadingBackdrop.backdrop();
		var customerId = Credentials.get().id;
		ElementModifier.validate($scope.form.customerEdit)
		.then(function() {
			var customerParams = _.pick($scope.customer, ['firstName', 'lastName', 'phoneNumber']);
			return Customer.update({id : customerId}, customerParams);
		})
		.then(function(customer) {
			$scope.customer = _.merge($scope.customer, customer);
			var addressParams = Address.getAddressFromResidencyInformation($scope.customer.residency);
			if (!addressParams)
			{
				// If no residency was provided, not requesting the Address update
				return $q.defer().resolve();
			}
			addressParams = _.merge(addressParams, {details: $scope.customer.details});
			return Address.update({id: customerId}, addressParams);
		})
		.then(function(address) {
			$scope.customer = _.merge($scope.customer, address);
			var authenticationParams = _.pick($scope.customer, ['email', 'oldPassword', 'newPassword']);
			return Authentication.updatePassword(authenticationParams);
		})
		.then(function() {
			$scope.oldPassword = '';
			$scope.newPassword = '';
			var customerSettings = _.pick($scope.customerSettings, ['notificationsEnabled', 'daysWithoutNotifying']);
			customerSettings.noNotificationAfter = $scope.customerSettings.noNotificationAfter.value;
			return CustomerSettings.update(customerSettings);
		})
		.then(function(customerSettings) {
			$scope.customerSettings = _.pick(customerSettings, ['notificationsEnabled', 'daysWithoutNotifying']);
			$scope.customerSettings.noNotificationAfter = _.find($scope.noNotificationAfterOptions, function(option) {
				return (option.value === customerSettings.noNotificationAfter);
			});
			Popup.displayTitleOnly($translate('customerEdited'), 3000);
		})
		.catch(function(errorMessage) {
			Popup.displayError(errorMessage, 3000);
		})
		.finally(function() {
			$scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
		});
	}

	$scope.onReload();
});
