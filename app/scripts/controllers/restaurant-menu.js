'use strict';

angular.module('groupeat.controllers.restaurant-menu', ['groupeat.services.pizza', 'groupeat.services.cart', 'groupeat.services.lodash', 'groupeat.services.order'])

.controller('RestaurantMenuCtrl', function($scope, $state, $stateParams, $filter, Pizza, Cart, $ionicNavBarDelegate, _, $ionicPopup, Order, $ionicHistory) {

	var $translate = $filter('translate');

	$scope.cart = Cart.getCart();
	$scope.cartTotalPrice = $scope.cart.cartTotalPrice ;
	$scope.data = {
		showDeleteList: false
	};

	$scope.pizzas = Pizza.get({restaurantId: $stateParams.restaurantId});
	
	$scope.currentOrder = Order.getCurrentOrder();
	$scope.cart.cartDiscount = $scope.currentOrder.currentDiscount;

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
			var leaveOrder = $ionicPopup.confirm({
				title: $translate('leaveOrder') ,
				template: $translate('cartWillBeDestroyed'),
				cancelType: 'button button-energized button-outline',
				okType: 'button button-energized'
			});
			leaveOrder.then(function(confirmation) {
				if(confirmation) {
					Cart.resetCart();
					Order.resetCurrentOrder();
					$ionicHistory.goBack();
				} else {
				}
			});
		}
	};
});
