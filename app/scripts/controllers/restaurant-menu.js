'use strict';

angular.module('groupeat.controllers.restaurant-menu', ['groupeat.services.pizza', 'groupeat.services.cart'])

.controller('RestaurantMenuCtrl', function($scope, $state, $stateParams, $filter, Pizza, Cart) {

/*  var $translate = $filter('translate');
*/
	$scope.cart = Cart.getCart();
	$scope.cartTotalPrice = $scope.cart.cartTotalPrice ;
	$scope.data = {
		showDeleteList: false
	};

	$scope.pizzas = Pizza.query({restaurantId: $stateParams.restaurantId});


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

	$scope.onProductDelete = function(product, formatIndex) {
		Cart.removeProductFromCart(product, formatIndex);
	};

	$scope.onProductAdd = function(product, format) {
		Cart.addProductToCart(product, format);
	};

});
