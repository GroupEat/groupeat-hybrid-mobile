'use strict';

angular.module('groupeat.controllers.restaurant-menu', [
	'ionic',
	'ngMaterial',
	'pascalprecht.translate',
	'groupeat.services.cart',
	'groupeat.services.lodash',
	'groupeat.services.message-backdrop',
	'groupeat.services.network',
	'groupeat.services.order',
	'groupeat.services.product',
])

.controller('RestaurantMenuCtrl', function($scope, $state, $stateParams, $filter, $mdDialog, MessageBackdrop, Network, Product, Cart, $ionicNavBarDelegate, _, Order, $ionicHistory) {

	var $translate = $filter('translate');

	$scope.isNewOrder = {
		value: null
	};

	$scope.initCart = function() {
		$scope.currentOrder = Order.getCurrentOrder();
		Cart.setDiscountRate($scope.currentOrder.currentDiscount);
		$scope.cart = Cart;
		$scope.isNewOrder.value = Order.isNewOrder();
	};

	$scope.onRefreshRestaurantMenu = function() {
		if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      return;
    }
		// Loading the menu of the restaurant
		Product.get($stateParams.restaurantId)
		.then(function(products) {
			$scope.products = products;
			if (_.isEmpty(products)) {
				$scope.messageBackdrop = {
					show: true,
					title: 'emptyMenuTitle',
					details: 'emptyMenuDetails',
					iconClasses: 'ion-android-pizza',
					button: {
						text: 'reload',
						action: 'onRefreshRestaurantMenu()'
					}
				};
			}
			else {
				$scope.messageBackdrop = MessageBackdrop.noBackdrop();
			}
		})
		.catch(function() {
			$scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurantMenu()');
		})
		.finally(function() {
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.toggleDetails = function(product) {
	    if ($scope.areDetailsShown(product)) {
	      $scope.detailedProduct = null;
	    }
	    else {
	      $scope.detailedProduct = product;
	    }
		};

	$scope.areDetailsShown = function(product) {
		return $scope.detailedProduct === product;
	};

	$scope.onDeleteProduct = function(product, formatIndex) {
		Cart.removeProduct(product, formatIndex);
	};

	$scope.onAddProduct = function(product, format) {
		Cart.addProduct(product, format);
	};

	$scope.onLeaveRestaurant = function() {
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
			$mdDialog.show(leaveOrder)
			.then(function() {
				Cart.reset();
				Order.resetCurrentOrder();
				$ionicHistory.goBack();
			});
		}
	};

	$scope.getTimeDiff = function (endingAt) {
		return Order.getTimeDiff(endingAt);
	};

	$scope.initCart();
	$scope.onRefreshRestaurantMenu();

});
