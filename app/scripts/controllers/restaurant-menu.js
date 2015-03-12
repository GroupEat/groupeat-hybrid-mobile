'use strict';

angular.module('groupeat.controllers.restaurant-menu', [
	'ngMaterial',
	'pascalprecht.translate',
	'groupeat.services.cart',
	'groupeat.services.lodash',
	'groupeat.services.order',
	'groupeat.services.pizza',
])

.controller('RestaurantMenuCtrl', function($scope, $state, $stateParams, $filter, $mdDialog, Pizza, Cart, $ionicNavBarDelegate, _, Order, $ionicHistory) {

	var $translate = $filter('translate');

	$scope.cart = Cart.getCart();
	$scope.cartTotalPrice = $scope.cart.cartTotalPrice ;
	$scope.data = {
		showDeleteList: false
	};

	$scope.pizzas = Pizza.get({restaurantId: $stateParams.restaurantId}, function() {
		_.forEach($scope.pizzas.data, function(pizza) {
			_.forEach(pizza.formats.data, function(format) {
				format.price = format.price / 100 ;
			});
		});
	});



	$scope.currentOrder = Order.getCurrentOrder();
	$scope.cart.cartDiscount = $scope.currentOrder.currentDiscount;


	$scope.isInGroupOrder = function() {
		if ($scope.currentOrder.groupOrderId !== null) {
			$scope.isInGroupOrder = true ;
		}
		else {
			$scope.isInGroupOrder = false ;
		}
	};
	$scope.isInGroupOrder();
	
	$scope.changeProductToShowValue = function(productToShow, formatIndex) {
		$scope.productToShowValue = 0;

		if (_.isEmpty($scope.cart.productsItems)) {
			// nothing to do...
		}
		else {
			_.forEach($scope.cart.productsItems, function(product) {
				if (product.id === productToShow.id) {
					_.forEach(product.formats, function(productFormats) {
						if(productFormats.id === formatIndex) {

							$scope.productToShowValue = productFormats.quantity ;
						}
						else {}
					});
				}
				else {}
			});
		}

	};

	$scope.toggleDetails = function(product) {
	    if ($scope.isDetailsShown(product)) {
	      $scope.shownDetails = null;
	    }
	    else {
	      $scope.shownDetails = product;
	    }
		};



	$scope.isDetailsShown = function(product) {
		return $scope.shownDetails === product;
	};

	$scope.onProductDelete = function(product, formatIndex) {
		Cart.removeProductFromCart(product, formatIndex);
	};

	$scope.onProductAdd = function(product, format) {
		Cart.addProductToCart(product, format);
	};

	$scope.onLeaveRestaurantTouch = function() {
		if (_.isEmpty($scope.cart.productsItems)) {
			Order.resetCurrentOrder();
			$ionicHistory.goBack();
		}
		else {
			var leaveOrder = $mdDialog.confirm()
			.title($translate('leaveOrder'))
			.content($translate('cartWillBeDestroyed'))
			.ok($translate('ok'))
			.cancel($translate('cancel'));
			$mdDialog.show(leaveOrder).then(function() {
				Cart.resetCart();
				Order.resetCurrentOrder();
				$ionicHistory.goBack();
			}, function() {
			});
		}
	};
});
