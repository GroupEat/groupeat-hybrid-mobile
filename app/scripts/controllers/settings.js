'use strict';

angular.module('groupeat.controllers.settings', [
  'groupeat.services.address',
  'groupeat.services.analytics',
  'groupeat.services.authentication',
  'groupeat.services.credentials',
  'groupeat.services.customer',
  'groupeat.services.customer-settings',
  'groupeat.services.element-modifier',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.popup',
  'jcs-autoValidate'
])

.controller('SettingsCtrl', function ($filter, $q, $rootScope, $scope, $state, _, Address, Analytics, Authentication, Credentials, Customer, CustomerSettings, ElementModifier, Network, Popup, $ionicSlideBoxDelegate) {

	Analytics.trackView('Restaurants');

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
    {
      id: 0,
      title: 'editProfile',
      url: 'templates/settings/settings-profile.html'
    },
    {
      id: 1,
      title: 'pushSettings',
      url: 'templates/settings/settings-notifications.html'
    }
  ];

	$scope.onReload = function() {
		var customerId = Credentials.get().id;

    Network.hasConnectivity()
    .then(function() {
      return Customer.get(customerId);
    })
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
		})
    .then(function() {
      $rootScope.$broadcast('hideMessageBackdrop');
    })
    .catch(function(errorKey) {
      $rootScope.$broadcast('displayMessageBackdrop', errorKey);
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
	};

  /*
  Switching tab
  */
  $scope.slideTo = function(slideId) {
    $ionicSlideBoxDelegate.slide(slideId);
  };

	/*
	Saving
	*/
	$scope.onSave = function() {
		var customerId = Credentials.get().id;

    Network.hasConnectivity()
    .then(function() {
      return ElementModifier.validate($scope.form.customerEdit);
    })
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
			// Clearing both passwords
			$scope.oldPassword = '';
			$scope.newPassword = '';
			var customerSettings = _.pick($scope.customerSettings, ['notificationsEnabled', 'daysWithoutNotifying']);
			customerSettings.noNotificationAfter = $scope.customerSettings.noNotificationAfter.value;
			return CustomerSettings.update(customerId, customerSettings);
		})
		.then(function(customerSettings) {
			$scope.customerSettings = _.pick(customerSettings, ['notificationsEnabled', 'daysWithoutNotifying']);
			$scope.customerSettings.noNotificationAfter = _.find($scope.noNotificationAfterOptions, function(option) {
				return (option.value === customerSettings.noNotificationAfter);
			});
			Popup.title('customerEdited');
		})
		.catch(function(errorMessage) {
			Popup.error(errorMessage);
		});
	};

  $scope.$on('$ionicView.afterEnter', function() {
    $scope.daysWithoutNotifyingOptions = CustomerSettings.getDaysWithoutNotifying();
		$scope.noNotificationAfterOptions = CustomerSettings.getNoNotificationAfterHours();
		$scope.residencies = Address.getResidencies();
    $scope.onReload();
  });

});
