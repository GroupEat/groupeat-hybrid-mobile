'use strict';

angular.module('groupeat.controllers.cart', [
	'groupeat.services.address',
	'groupeat.services.authentication',
	'groupeat.services.cart',
	'groupeat.services.lodash',
	'groupeat.services.order',
	'groupeat.services.predefined-addresses',
	'ngMaterial'
])

.controller('CartCtrl', function($scope, $state, _, Cart, Order, $q, Popup, $mdDialog, $filter, Address, Authentication, PredefinedAddresses) {

	var $translate = $filter('translate');
	$scope.cart = Cart.getCart();
	$scope.isCartEmpty = _.isEmpty($scope.cart.productsItems);
	$scope.currentOrder = Order.getCurrentOrder();
	$scope.FoodRushTime = {
		value : null
	};
	$scope.FoodRushTimeData = [
      { label: '5 min', value: 5 },
      { label: '10 min', value: 10 },
      { label: '15 min', value: 15 },
      { label: '30 min', value: 30 },
      { label: '45 min', value: 45 }
    ];

	/* I added here the get to predefined addresses, because it's a very long request, and returned "resolved: false" until i put it here*/
	$scope.predefinedAddresses = PredefinedAddresses.get();
	$scope.userCredit = Authentication.getCredentials(function(response) {
		$scope.userAddress = Address.getAddress({id: response.id });
	});

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

	/*$scope.showEditAddressDialog = function(ev) {
	    $scope.userReset = {};
	    $mdDialog.show({
	      targetEvent: ev,
	      templateUrl: 'templates/popups/cart-enter-address.html',
	      controller: 'CartCtrl',
	      disableParentScroll: false
	    });
	};

	$scope.closeEditAddressDialog = function(address, cancel) {
	    return (cancel) ? $mdDialog.hide() : $scope.validateForm(form)
	    .then(function() {
	      Authentication.resetPassword($scope.userReset)
	      .then(function() {
	        $mdDialog.hide();
	      })
	      .catch(function(errorKey) {
	        form.email.$setValidity(errorKey, false);
	      });
	    });
};*/
	$scope.debug = function() {
		//console.log($scope.FoodRushTime.value);
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
			.then(function(ev) {
				$mdDialog.show({
					targetEvent: ev,
					templateUrl: 'templates/popups/ask-for-address.html',
					clickOutsideToClose: false,
					controller: 'CartCtrl',
				});
			})
			.catch(function(errorMessage) {
				return Popup.displayError(errorMessage, 4000);
			});
	};

	$scope.closeAskForAddressDialog = function(deliveryAddress, cancel, personalAddressSelected) {

		if(cancel)
		{
			$mdDialog.cancel();
		}
		else
		{
			// TODO : process showing "circle running"
			$scope.validateAddress(deliveryAddress, personalAddressSelected)
			.then(function() {
				if (personalAddressSelected)
				{
					// TODO
				}
				else if (!personalAddressSelected)
				{
					_.forEach($scope.predefinedAddresses.data, function(predefinedAddress) {
						if (predefinedAddress.details === deliveryAddress)
						{
							Order.setStreet(predefinedAddress.street);
							Order.setDetails(predefinedAddress.details);
							Order.setLatitude(predefinedAddress.latitude);
							Order.setLongitude(predefinedAddress.longitude);
						}
					});
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
		$scope.deliveryAddress = undefined;
	};

});
