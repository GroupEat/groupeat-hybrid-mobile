'use strict';

angular.module('groupeat.controllers.settings', [
	'groupeat.services.address',
	'groupeat.services.authentication',
	'groupeat.services.credentials',
	'groupeat.services.customer',
	'groupeat.services.customer-settings',
	'groupeat.services.element-modifier',
	'groupeat.services.lodash',
	'groupeat.services.message-backdrop',
	'groupeat.services.network',
	'groupeat.services.popup',
	'jcs-autoValidate'
])

.controller('SettingsCtrl', function($filter, $scope, $state, _, Address, Authentication, Credentials, Customer, CustomerSettings, ElementModifier, MessageBackdrop, Network, Popup) {

	var $translate = $filter('translate');

	/*
	Models
	*/
	$scope.customer = {};
	$scope.form = {};
	$scope.notificationsPreferences = {};

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
		// Loading notification related options
		$scope.daysWithoutNotifyingOptions = CustomerSettings.getDaysWithoutNotifying();
		$scope.noNotificationAfterOptions = CustomerSettings.getNoNotificationAfterHours();
		$scope.residencies = Address.getResidencies();

		if (!Network.hasConnectivity())
		{
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
			if (address)
			{
				var residency = Address.getResidencyInformationFromAddress(address);
				$scope.customer = _.merge($scope.customer, {'residency': residency, 'details': address.details});
			}
			return CustomerSettings.get(customerId);
		})
		.then(function(customerSettings) {
			$scope.customerSettings = _.pick(customerSettings, ['notificationsEnabled', 'daysWithoutNotifying']);
			$scope.customerSettings.noNotificationAfter = _.find($scope.noNotificationAfterOptions, function(option) {
				return (option.value === customerSettings.noNotificationAfter);
			});
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
			var authenticationParams = _.pick($scope.customer, ['email', 'oldPassword', 'newPassword']);
			return Authentication.updatePassword(authenticationParams);
		})
    .then(function() {
			Popup.displayTitleOnly($translate('customerEdited'), 3000);
    })
    .catch(function(errorMessage) {
      Popup.displayError(errorMessage, 3000);
    });
	};

	$scope.onReload();

});
