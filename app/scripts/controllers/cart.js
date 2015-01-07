'use strict';

angular.module('groupeat.controllers.cart', ['groupeat.services.cart', 'groupeat.services.lodash' ])

.controller('CartCtrl', function($scope, $state, _, Cart) {

	$scope.cart = Cart.getCart() ;
	$scope.data = {
		showDeleteList: false
	};

	$scope.refreshCart = function() {
		$scope.cartTotalPrice = 0 ;
		$scope.cartTotalQuantity = 0 ;

		$scope.isCartEmpty = _.isEmpty($scope.cart);

		_.forEach($scope.cart, function(product) {
			product.totalQuantity = 0 ;
			product.totalPrice = 0 ;
			_.forEach(product.formats, function(productFormats) {
				product.totalPrice += productFormats.price*productFormats.quantity ;
				product.totalQuantity += productFormats.quantity ;
			});
			
			$scope.cartTotalPrice += product.totalPrice ;
			$scope.cartTotalQuantity += product.totalQuantity ;
			if (product.totalQuantity === 0) {
				$scope.cart.splice(_.indexOf(product) - 1, 1);
			}
		});
	};

	$scope.refreshCart() ; // for init onload
	$scope.$watch('cart', $scope.refreshCart, true);

	$scope.toggleDetails = function(product) {
	    if ($scope.isDetailsShown(product)) {
	      $scope.shownDetails = null;
	    } else {
	      $scope.shownDetails = product;
	    }
		};
	$scope.isDetailsShown = function(product) {
	  return $scope.shownDetails === product;
	};

	$scope.onConfirmCommandTouch = function() {
	};

	$scope.onProductDelete = function(productIndex, formatIndex) {
		Cart.removeProductFromCart(productIndex, formatIndex);
	};

	$scope.onProductAdd = function(productIndex, formatIndex) {
		Cart.addProductToCart(productIndex, formatIndex);
	};
	
});
