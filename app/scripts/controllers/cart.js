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

	/* -------------------------------------------------------------------------
	All variables are defined here.
	It is usual here to define an object to use its 'value' propoerty, and its 'hasValue' one
	It is an angular way, especially if those variables are used in ngModels
	   ------------------------------------------------------------------------
	*/
	var $translate = $filter('translate');

	$scope.currentOrder = Order.getCurrentOrder();
	$scope.foodRushTime = {
		value: null
	};
	$scope.addressTypeSelected = {
		value: null
	};

	$scope.foodRushTimeData = [
		{ label: $translate('fiveMin'), value: 5 },
		{ label: $translate('tenMin'), value: 10 },
		{ label: $translate('fifteenMin'), value: 15 },
		{ label: $translate('thirtyMin'), value: 30 },
		{ label: $translate('fortyFiveMin'), value: 45 }
	];

	$scope.addressTypes = [
		{ label: $translate('myAddress'), value: 'myAddress' },
		{ label: $translate('newAddress'), value: 'newAddress'},
		{ label: $translate('predefinedAddress'), value: 'predefinedAddress'}
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

/* --------------------------------------------------------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
	Here comes the loading methods. It's kind of constructor of ctrl, they are called
	when ctrl is created, and could be recalled if they have to.
	They load information, such as user address, predefined addresses, cart,...
	   ------------------------------------------------------------------------
	*/

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

/* --------------------------------------------------------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
	Here comes the confirm order part. After user has fulled information, such as the 
	wanted time for FoodRush, a Popup shows to ask for the delivery address.
	There is here two functions : the first sets the Order and calls the popup ;
	the second is calling when user leaves popup. This is the second function in which 
	all validation is made, and in which we process to the backend request PlaceOrder
	   ------------------------------------------------------------------------
	*/

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
				else if ($scope.addressTypeSelected.value === 'newAddress')
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
				Popup.displayTitleOnly($translate('ordered'), 3000);
			})
	    .catch(function(errorMessage) {
	      return Popup.displayError(errorMessage, 4000);
	    });
		}
	};

/* --------------------------------------------------------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
	Here comes the validation functions.
	The first is calling when user first confirms its order (after choosing foodrush time)
	The second is calling when user confirm its delivery Address.
	   ------------------------------------------------------------------------
	*/

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
		/* TODO : validate address format ? */
		var deferred = $q.defer();
		deferred.resolve();
		return deferred.promise;
	};

/* --------------------------------------------------------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
	Here comes the beautiful binding between html and ctrl.
	We handle here to update variables in html according to user interaction.
	   ------------------------------------------------------------------------
	*/

	$scope.detectPlaceholder = function() {
		/*
		this function is called by ngChange when user interact with all inputs (mdSelect, mdInput)
		*/
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

		$scope.shouldAddressDialogConfirmButtonBeDisable();
	};

	$scope.shouldAddressDialogConfirmButtonBeDisable = function() {
		/*
		This function return true if the OK button of popup should be disabled,
		else false.
		Depends on which radio button is on (= which addressType has been
		selected), we check if a delivery address has been selected/entered
		*/
		var shouldBeDisable ;

		if ($scope.addressTypeSelected.value === 'myAddress') {
			if ($scope.hasPredefinedPersonalAddress.hasValue) {
				if ($scope.hasPredefinedPersonalAddress.value) {
					shouldBeDisable = false;
				}
				else {
					shouldBeDisable = true;
				}
			}
			else {
				shouldBeDisable = true;
			}
		}
		else if ($scope.addressTypeSelected.value === 'newAddress') {
			if($scope.deliveryAddress.hasValue && $scope.addressSupplement.hasValue) {
				shouldBeDisable = false;
			}
			else {
				shouldBeDisable = true;
			}
		}
		else if ($scope.addressTypeSelected.value === 'predefinedAddress') {
			if($scope.predefinedDeliveryAddress.hasValue) {
				shouldBeDisable = false;
			}
			else {
				shouldBeDisable = true;
			}
		}
		else {
			shouldBeDisable = true;
		}
		return shouldBeDisable;
	};

	$scope.resetDeliveryAddress = function() {
		/*
		this function is called when user interact with radio button,
		which means when user changes the type of delivery address 
		(personal, predefined, or new)
		*/
		$scope.deliveryAddress.value = null;
		$scope.addressSupplement.value = null;
		$scope.predefinedDeliveryAddress.value = null;
		$scope.detectPlaceholder();
	};

/* --------------------------------------------------------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
	Here comes the "construction" part of the ctrl. 
	   ------------------------------------------------------------------------
	*/

	$scope.loadCart();
	$scope.loadAddressInformation();

});

	/* -------------------------------------------------------------------------
	Here comes the sun... 
	   ------------------------------------------------------------------------
	*/
