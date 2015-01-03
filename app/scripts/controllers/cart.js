'use strict';

angular.module('groupeat.controllers.cart', ['groupeat.services.cart', 'groupeat.services.lodash' ])

.controller('CartCtrl', function($scope, $state, Cart, _) {

	$scope.cart = Cart.query(function(cart) {
		_.forEach(cart, function(product) {
			$scope.cartTotalPrice += product.price*product.number;
		});
	});

	$scope.data = {
		showDeleteItem: false
	};

	$scope.onConfirmCommandTouch = function() {
		console.log($scope.cartTotalPrice);
	};
	
	$scope.onItemDelete = function(index) {
	    $scope.cart.splice(index, 1);
		};
	
});
