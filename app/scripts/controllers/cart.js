'use strict';

angular.module('groupeat.controllers.cart', [
	'ngMaterial',
	'ngAutocomplete',
	'pascalprecht.translate',
	'groupeat.services.address',
	'groupeat.services.authentication',
	'groupeat.services.cart',
	'groupeat.services.lodash',
	'groupeat.services.order',
	'groupeat.services.predefined-addresses'
])

.controller('CartCtrl', function($scope, $state, _, Cart, Order, $q, Popup, $mdDialog, $filter, Address, Authentication, PredefinedAddresses) {

	var $translate = $filter('translate');
	$scope.cart = Cart.getCart();
	$scope.isCartEmpty = _.isEmpty($scope.cart.productsItems);
	$scope.currentOrder = Order.getCurrentOrder();
	$scope.FoodRushTime = {
		value: null
	};
	$scope.AddressTypeSelected = {
		value: null
	};
	$scope.FoodRushTimeData = [
		{ label: '5 min', value: 5 },
		{ label: '10 min', value: 10 },
		{ label: '15 min', value: 15 },
		{ label: '30 min', value: 30 },
		{ label: '45 min', value: 45 }
	];

	$scope.addressTypes = [
		{ label: 'Mon adresse', value: 'myAddress' },
		{ label: 'Nouvelle adresse', value: 'enterAddress'},
		{ label: 'Lieu commun', value: 'predefinedAddress'}
	];

	$scope.DeliveryAddress = {
		value: null
	};
	$scope.AddressSupplement = {
		value: null
	};
	$scope.PredefinedDeliveryAddress = {
		value: null
	};
	$scope.SaveNewAddress = {
		value: null
	};

	$scope.residencies = Address.getResidencies();

	/* I added here the get to predefined addresses, because it's a very long request, and returned "resolved: false" until i put it here*/
	$scope.predefinedAddresses = PredefinedAddresses.get();
	$scope.userCredit = Authentication.getCredentials();
	$scope.userAddress = Address.getAddress({id: $scope.userCredit.id });
	$scope.hasPredefinedPersonalAddress = _.isEmpty($scope.userAddress.data) ;

	$scope.validateOrder = function() {
		var deferred = $q.defer();
		if(Order.getCurrentOrder().groupOrderId === null && $scope.FoodRushTime.value === null) {
			deferred.reject($translate('missingFoodRushTime'));
		}
	    else
		{
			deferred.resolve();
		}
		return deferred.promise;
	};

	$scope.validateAddress = function() {
		var deferred = $q.defer();
		if(false)
		{

		}
	    else
		{
			deferred.resolve();
		}
		return deferred.promise;
	};

	$scope.debug = function() {
		// console.log($scope.addressTypeSelected);
	};

	$scope.onConfirmOrderTouch = function(ev) {
		$scope.validateOrder()
		.then(function() {
				var productFormats = {};
				_.forEach($scope.cart.productsItems, function(product) {
					_.forEach(product.formats, function(format) {
						if(format.quantity > 0) {
							productFormats[format.id] = format.quantity;
						}
					});
				});

				Order.setGroupOrderId(Order.getCurrentOrder().groupOrderId);
				Order.setFoodRushTime($scope.FoodRushTime.value);
				Order.setProductFormats(productFormats);

			})
			.then(function() {
				$mdDialog.show({
					targetEvent: ev,
					templateUrl: 'templates/popups/ask-for-address.html',
					controller: 'CartCtrl',
				});
			})
			.catch(function(errorMessage) {
				return Popup.displayError(errorMessage, 4000);
			});
	};

	$scope.closeAskForAddressDialog = function(cancel) {

		if(cancel)
		{
			$mdDialog.cancel();
		}
		else
		{


			// TODO : process showing "circle running"
			$scope.validateAddress($scope.AddressTypeSelected.value)
			.then(function() {
				if ($scope.AddressTypeSelected.value === 'myAddress')
				{
					Order.setStreet($scope.userAddress.data.street);
					Order.setDetails($scope.userAddress.data.details);
					Order.setLatitude($scope.userAddress.data.latitude);
					Order.setLongitude($scope.userAddress.data.longitude);
				}
				else if ($scope.AddressTypeSelected.value === 'enterAddress')
				{
					/* TODO : get information from residency */
					var residencyInformations = Address.getAddressFromResidencyInformation($scope.DeliveryAddress.value);
					Order.setStreet(residencyInformations.street);
					Order.setDetails($scope.AddressSupplement.value);
					Order.setLatitude(residencyInformations.latitude);
					Order.setLongitude(residencyInformations.longitude);

					if ($scope.SaveNewAddress.value)
					{
						var addressParams = {
							'street': residencyInformations.street,
							'details': $scope.AddressSupplement.value,
							'latitude': residencyInformations.latitude,
							'longitude': residencyInformations.longitude
						};
						Address.update({id: $scope.userCredit.id}, addressParams);
					}
				}
				else if ($scope.AddressTypeSelected.value === 'predefinedAddress')
				{
					_.forEach($scope.predefinedAddresses.data, function(predefinedAddress) {
						if (predefinedAddress.details === $scope.PredefinedDeliveryAddress.value)
						{
							Order.setStreet(predefinedAddress.street);
							Order.setDetails(predefinedAddress.details);
							Order.setLatitude(predefinedAddress.latitude);
							Order.setLongitude(predefinedAddress.longitude);
						}
					});
				}
				else {

				}
			})
			.then(function() {
				return Order.save();
			})
			.then(function() {
				$mdDialog.hide();
				Cart.resetCart();
				Order.resetCurrentOrder();
				$state.go('group-orders');
				Popup.displayTitleOnly('Votre commande a bien été passée', 3000);
			})
		    .catch(function(errorMessage) {
		      return Popup.displayError(errorMessage, 4000);
		    });
		}
	};

	$scope.resetDeliveryAddress = function() {
		$scope.DeliveryAddress.value = undefined;
		$scope.AddressSupplement.value = undefined;
		$scope.PredefinedDeliveryAddress.value = undefined;
		$scope.SaveNewAddress.value = false;
	};

});
