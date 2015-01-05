'use strict';

angular.module('groupeat.controllers.cart', ['groupeat.services.cart', 'groupeat.services.lodash' ])

.controller('CartCtrl', function($scope, $state, Cart, _) {

	
	$scope.cart = Cart.query(function(cart) {
		_.forEach(cart, function(product) {
			$scope.cartTotalPrice += product.price*product.number;
			$scope.cartTotalNumber += product.number;
		});
		$scope.isCartEmpty = _.isEmpty(cart);
	});

	$scope.data = {
		showDeleteList: false
	};

	$scope.onConfirmCommandTouch = function() {
	};

	$scope.onItemDelete = function(index) { // Backend request to delete item
	    $scope.cart.splice(index, 1);
		};
	
});
