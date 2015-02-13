'use strict';

angular.module('groupeat.controllers.cart', [
	'groupeat.services.cart',
	'groupeat.services.lodash',
	'groupeat.services.order',
	'ngMaterial'
])

.controller('CartCtrl', function($scope, $state, _, Cart, Order, $q, Popup) {

	$scope.cart = Cart.getCart();
	$scope.isCartEmpty = _.isEmpty($scope.cart.productsItems);
	$scope.currentOrder = Order.getCurrentOrder();

	$scope.validateOrder = function() {
		var deferred = $q.defer();
		if (false /*invalid order*/) {}
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

	$scope.onConfirmOrderTouch = function() {
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

			var requestBody = {
				'groupOrderId': Order.getCurrentOrder().groupOrderId,
				'foodRushDurationInMinutes': 25,
				'productFormats': productFormats,
				'street': 'Allée des techniques avancées',
				'details': 'Bâtiment A, chambre 200',
				'latitude': 48.711042,
				'longitude': 2.219278
			};

			console.log(requestBody);
			return Order.save(requestBody);
		})
	    .then(function() {
	      console.log('everything ok');
	    })
	    .catch(function(errorMessage) {
	      return Popup.displayError(errorMessage, 3000);
	    });
	};

});
