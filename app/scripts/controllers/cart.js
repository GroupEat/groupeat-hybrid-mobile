'use strict';

angular.module('groupeat.controllers.cart', ['groupeat.services.cart', 'groupeat.services.lodash' ])

.controller('CartCtrl', function($scope, $state, _, Cart) {

	$scope.cart = Cart.getCart() ;
	$scope.data = {
		showDeleteList: false
	};


	console.log($scope.cart);


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

	$scope.onConfirmCommandTouch = function() {
	};

	$scope.onItemDelete = function(index) { // Backend request to delete item
	    Cart.removeProductFromCart(index);
	    console.log($scope.cart);
	    console.log($scope.isCartEmpty);
		};
	
});
