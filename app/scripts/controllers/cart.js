'use strict';

angular.module('groupeat.controllers.cart', [
	'ngMaterial',
	'ngAutocomplete',
	'pascalprecht.translate',
	'groupeat.services.address',
	'groupeat.services.cart',
	'groupeat.services.credentials',
	'groupeat.services.lodash',
	'groupeat.services.message-backdrop',
	'groupeat.services.order',
	'groupeat.services.predefined-addresses'
])

.controller('CartCtrl', function($scope, $state, _, Cart, Order, $q, Popup, $mdDialog, $filter, Address, Credentials, MessageBackdrop, PredefinedAddresses) {

	var $translate = $filter('translate');

	$scope.currentOrder = Order.getCurrentOrder();
	$scope.foodRushTime = {
		value: null
	};
	$scope.addressTypeSelected = {
		value: null
	};

	$scope.foodRushTimeData = [
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

	$scope.deliveryAddress = {
		hasValue: false,
		value: null
	};

	$scope.isNewOrder = {
		value: null
	};
	$scope.addressSupplement = {
		hasValue: false,
		value: null
	};
	$scope.predefinedDeliveryAddress = {
		hasValue: false,
		value: null
	};

	$scope.hasPredefinedPersonalAddress = {
		hasValue: false,
		value: null
	};

	$scope.detectPlaceholder = function() {
		if($scope.deliveryAddress.value === null) {
			$scope.deliveryAddress.hasValue = false;
		}
		else {
			$scope.deliveryAddress.hasValue = true;
		}

		if($scope.addressSupplement.value === null || $scope.addressSupplement.value === '') {
			$scope.addressSupplement.hasValue = false;
		}
		else {
			$scope.addressSupplement.hasValue = true;
		}

		if($scope.predefinedDeliveryAddress.value === null) {
			$scope.predefinedDeliveryAddress.hasValue = false;
		}
		else {
			$scope.predefinedDeliveryAddress.hasValue = true;
		}
	};

	$scope.loadCart = function() {
		$scope.cart = Cart;
		if (_.isEmpty(Cart.getProducts()))
		{
			$scope.messageBackdrop = {
				show: true,
				title: 'emptyCartTitle',
				details: 'emptyCartDetails',
				iconClasses: 'ion-ios-cart',
			};
		}
		else
		{
			$scope.messageBackdrop = MessageBackdrop.noBackdrop();
			if(Order.getCurrentOrder().groupOrderId === null) {
				$scope.isNewOrder.value = true ;
			}
			else {
				$scope.isNewOrder.value = false ;
			}
		}
	};

	$scope.loadAddressInformation = function() {
		$scope.residencies = Address.getResidencies();
		PredefinedAddresses.get()
		.then(function(predefinedAddresses) {
			$scope.predefinedAddresses = predefinedAddresses;
			return Address.get(Credentials.get().id);
		})
		.then(function(userAddress) {
			$scope.userAddress = userAddress;
			$scope.hasPredefinedPersonalAddress.value = _.isEmpty($scope.userAddress.data);
			$scope.hasPredefinedPersonalAddress.hasValue = true;
		})
		.catch(function() {
			$scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshGroupOrders()');
		});
	};

	$scope.validateOrder = function() {
		var deferred = $q.defer();
		if(Order.getCurrentOrder().groupOrderId === null && $scope.foodRushTime.value === null)
		{
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
		deferred.resolve();
		return deferred.promise;
	};

	$scope.debug = function() {
		// console.log($scope.addressTypeSelected);
	};

	$scope.onConfirmOrderTouch = function(ev) {
		$scope.validateOrder()
		.then(function() {
			var productFormats = {};
			_.forEach(Cart.getProducts(), function(product) {
				_.forEach(product.formats, function(format) {
					if(format.quantity > 0) {
						productFormats[format.id] = format.quantity;
					}
				});
			});
			console.log(productFormats);
			Order.setGroupOrderId(Order.getCurrentOrder().groupOrderId);
			Order.setFoodRushTime($scope.foodRushTime.value);
			Order.setProductFormats(productFormats);

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
			$scope.validateAddress($scope.addressTypeSelected.value)
			.then(function() {
				if ($scope.addressTypeSelected.value === 'myAddress')
				{
					console.log($scope.userAddress);
					Order.setStreet($scope.userAddress.street);
					Order.setDetails($scope.userAddress.details);
					Order.setLatitude($scope.userAddress.latitude);
					Order.setLongitude($scope.userAddress.longitude);
				}
				else if ($scope.addressTypeSelected.value === 'enterAddress')
				{
					/* TODO : get information from residency */
					var residencyInformations = Address.getAddressFromResidencyInformation($scope.deliveryAddress.value);
					console.log(residencyInformations);
					Order.setStreet(residencyInformations.street);
					Order.setDetails($scope.addressSupplement.value);
					Order.setLatitude(residencyInformations.latitude);
					Order.setLongitude(residencyInformations.longitude);

					/* Update User address code, keeping for calzone or later...
					if ($scope.SaveNewAddress.value)
					{
						var addressParams = {
							'street': residencyInformations.street,
							'details': $scope.AddressSupplement.value,
							'latitude': residencyInformations.latitude,
							'longitude': residencyInformations.longitude
						};
						Address.update({id: $scope.userCredit.id}, addressParams);
					}*/
				}
				else if ($scope.addressTypeSelected.value === 'predefinedAddress')
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
				return Order.save();
			})
			.then(function() {
				$mdDialog.hide();
				Cart.reset();
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
		$scope.deliveryAddress.value = null;
		$scope.addressSupplement.value = null;
		$scope.predefinedDeliveryAddress.value = null;
		$scope.detectPlaceholder();
	};

	$scope.loadCart();
	$scope.loadAddressInformation();

});
