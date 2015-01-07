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
			_.forEach(product.formats, function(formats) {
				$scope.cartTotalPrice += formats.price*formats.quantity;
				$scope.cartTotalQuantity +=  formats.quantity ;
			});
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
