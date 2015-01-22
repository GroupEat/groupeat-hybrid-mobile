'use strict';

angular.module('groupeat.controllers.cart', ['groupeat.services.cart', 'groupeat.services.lodash', 'groupeat.services.order' ])

.controller('CartCtrl', function($scope, $state, _, Cart, Order) {

	$scope.cart = Cart.getCart();
	$scope.isCartEmpty = _.isEmpty($scope.cart.productsItems);
	$scope.currentOrder = Order.getCurrentOrder();
	
});
