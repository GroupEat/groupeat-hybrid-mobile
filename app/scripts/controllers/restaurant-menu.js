'use strict';

angular.module('groupeat.controllers.restaurant-menu', [
	'groupeat.services.analytics',
	'groupeat.services.cart',
	'groupeat.services.lodash',
	'groupeat.services.message-backdrop',
	'groupeat.services.network',
	'groupeat.services.order',
	'groupeat.services.product',
	'groupeat.services.popup',
	'groupeat.services.restaurant',
	'ionic',
	])

<<<<<<< HEAD
.controller('RestaurantMenuCtrl', function(_, $ionicHistory, $ionicModal, $ionicScrollDelegate, $q, $scope, $state, $stateParams, $timeout, Analytics, Cart, MessageBackdrop, Network, Order, Popup, Product, Restaurant) {
=======
.controller('RestaurantMenuCtrl', function(_, $ionicHistory, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, $q, $scope, $state, $stateParams, $timeout, Analytics, Cart, MessageBackdrop, Network, Order, Popup, Product) {
>>>>>>> Address slide

	Analytics.trackEvent('Restaurant', 'View', null, $stateParams.restaurantId);

	$scope.groups = [];
	$scope.isNewOrder = {
		value: null
	};
	$scope.foodRushTime = {};
	$scope.foodRushTime.value = 35;

	$scope.initCtrl = function() {
		$scope.currentOrder = Order.getCurrentOrder();
		Cart.setDiscountRate($scope.currentOrder.currentDiscount);
		$scope.cart = Cart;
		$scope.isNewOrder.value = Order.isNewOrder();
		$scope.onReload();
	};

	$scope.onReload = function() {
		var deferred = $q.defer();
		Network.hasConnectivity()
		.then(function() {
			return Restaurant.get($stateParams.restaurantId);
		})
		.then(function(restaurant) {
			$scope.restaurant = restaurant;
			return Product.get($stateParams.restaurantId);
		})
		.then(function(products) {
			$scope.products = products;
			if (_.isEmpty(products)) {
				$scope.messageBackdrop = MessageBackdrop.backdrop('emptyMenu', 'ion-android-pizza');
			} else {
				$scope.messageBackdrop = MessageBackdrop.noBackdrop();
			}
			deferred.resolve();
		})
		.catch(function(errorKey) {
			$scope.messageBackdrop = MessageBackdrop.backdropFrom(errorKey);
			deferred.reject();
		})
		.finally(function() {
			$scope.$broadcast('scroll.refreshComplete');
		});

		return deferred.promise;
	};

	$scope.toggleDetails = function(product) {
		$scope.detailedProduct = $scope.areDetailsShown(product) ? null : product;
	};

	$scope.areDetailsShown = function(product) {
		return $scope.detailedProduct === product;
	};

	$scope.onDeleteProduct = function(product, format) {
		Cart.removeProduct(product, format);
		Order.updateCurrentDiscount($scope.cart.getTotalPrice());
	};

	$scope.onAddProduct = function(product, format) {
		if ($scope.cart.getTotalQuantity() >= $scope.currentOrder.remainingCapacity) {
			Popup.error('tooManyProducts');
		}
		else {
			Cart.addProduct(product, format);
			Order.updateCurrentDiscount($scope.cart.getTotalPrice());
		}
	};

	$scope.onLeaveRestaurant = function() {
		if (_.isEmpty($scope.cart.getProducts())) {
			Order.resetCurrentOrder();
			$ionicHistory.goBack();
		}
		else {
			Popup.confirm('leaveOrder', 'cartWillBeDestroyed')
			.then(function(res) {
				if(res) {
					Cart.reset();
					Order.resetCurrentOrder();
					$ionicHistory.goBack();
				}
			});
		}
	};

	$scope.getTimeDiff = function (endingAt) {
		return Order.getTimeDiff(endingAt);
	};

	$scope.getDiscountPrice = function() {
		return $scope.cart.getTotalPrice() * (1 - Order.getCurrentDiscount()/100) ;
	};

	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			group.isShown = false;
		} else {
			group.isShown = true;
		}
		$timeout(function() {
			$ionicScrollDelegate.resize();
		}, 300);
	};

	$scope.isGroupShown = function(group) {
		return group.isShown;
	};

<<<<<<< HEAD
<<<<<<< HEAD
=======
	$scope.confirmButtonsTitles = ['Valider ma commande !', 'Valider mon adresse !'];

	$scope.activeButtonTitle = $scope.confirmButtonsTitles[0];

	$scope.slideHasChanged = function(index) {
		$scope.activeButtonTitle = $scope.confirmButtonsTitles[index];
	};
=======
>>>>>>> Address slide

	/* This will have to be replaced by actual data, currently placeholder */
	$scope.receipt = {
		restaurantName: 'Allo Pizza 91',
		date: '02/07/2015',
		orders: [
			{
				count: 3,
				name: 'Napolitaine',
				format: 'Junior',
				price: 24.00
			},
			{
				count: 1,
				name: 'Paysanne',
				format: 'Mega',
				price: 16.58
			},
			{
				count: 2,
				name: 'Classica',
				format: 'Senior',
				price: 20.02
			}
		],
		subTotal: 70.60,
		reduction: 43,
		total: 40.24
	};
>>>>>>> Cart page — Done

	$scope.slideIndex = 0;

	$scope.confirmButtons = [
		{title: 'Valider ma commande !', color: 'green'},
		{title: 'Valider mon adresse !', color: 'orange'}
	];

	$scope.address = {
		name: 'preset',
		new: 'ensta',
		common: 'foyer'
	};

	$scope.activeButton = $scope.confirmButtons[0];

	$scope.slideHasChanged = function(index) {
		$scope.slideIndex = index;
		$scope.activeButton = $scope.confirmButtons[index];
	};

	$ionicModal.fromTemplateUrl('templates/modals/cart.html', {
		scope: $scope,
		animation: 'slide-in-up'
	})
	.then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openCart = function() {
		$scope.modal.show();
	};

	$scope.closeCart = function() {
		$scope.modal.hide();
	};
<<<<<<< HEAD

=======
>>>>>>> Cart page — Done

	$scope.confirmButtonAction = function() {
		if($scope.slideIndex === 0) {
			$ionicSlideBoxDelegate.slide(1);
		} else {
			//Confirm Order
		}
	};

});
