'use strict';

angular.module('groupeat.controllers.cart', ['groupeat.services.cart', 'groupeat.services.lodash' ])

.controller('CartCtrl', function($scope, $state, _, Cart) {

	$scope.cart = Cart.getCart() ;

	_.forEach($scope.cart, function(product) {
		$scope.cartTotalPrice += product.formats.price*product.formats.quantity;
		$scope.cartTotalNumber +=  product.formats[0].quantity + product.formats[1].quantity + product.formats[2].quantity;
	});
	
	$scope.isCartEmpty = _.isEmpty($scope.cart);

	$scope.data = {
		showDeleteList: false
	};

	$scope.onConfirmCommandTouch = function() {
		console.log($scope.cartHasChanged);
	};

	$scope.onItemDelete = function(index) { // Backend request to delete item
	    Cart.removeProductFromCart(index);
		};
	
});
