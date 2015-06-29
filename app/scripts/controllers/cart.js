'use strict';

angular.module('groupeat.controllers.cart', [
  'ngMaterial',
  'ngAutocomplete',
  'pascalprecht.translate',
  'groupeat.services.address',
  'groupeat.services.analytics',
  'groupeat.services.cart',
  'groupeat.services.credentials',
  'groupeat.services.lodash',
  'groupeat.services.loading-backdrop',
  'groupeat.services.message-backdrop',
  'groupeat.services.order',
  'groupeat.services.predefined-addresses'
])

.controller('CartCtrl', function ($scope, $state, $ionicHistory, _, Analytics, Cart, Order, $q, LoadingBackdrop, Popup, $mdDialog, $filter, Address, Credentials, MessageBackdrop, PredefinedAddresses) {
  var $translate = $filter('translate');
  Analytics.trackView('Cart');
  $scope.currentOrder = Order.getCurrentOrder();
  $scope.foodRushTime = { value: null };
  $scope.addressTypeSelected = { value: null };
  $scope.addressTypes = [
    {
      label: $translate('myAddress'),
      value: 'myAddress'
    },
    {
      label: $translate('newAddress'),
      value: 'newAddress'
    },
    {
      label: $translate('predefinedAddress'),
      value: 'predefinedAddress'
    }
  ];

  $scope.deliveryAddress = {
    hasValue: false,
    value: null
  };

  $scope.isNewOrder = { value: null };

  $scope.addressSupplement = {
    hasValue: false,
    value: null
  };

  $scope.predefinedDeliveryAddress = {
    hasValue: false,
    value: null
  };

  $scope.hasPredefinedPersonalAddress = {
    hasValue: false,
    value: null
  };

	$scope.loadCart = function() {
		$scope.cart = Cart;
		$scope.currentDiscount = Order.getCurrentDiscount();
		$scope.foodRushTime.value = Order.getFoodRushTime() || 0 ;
		if (_.isEmpty(Cart.getProducts()))
		{
			$scope.messageBackdrop = {
				show: true,
				title: 'emptyCartTitle',
				details: 'emptyCartDetails',
				iconClasses: 'ion-ios-cart',
			};
		}
		else
		{
			$scope.messageBackdrop = MessageBackdrop.noBackdrop();
			$scope.isNewOrder.value = Order.isNewOrder();
		}
	};

  $scope.comment = { value: null };

  $scope.onSliderChanged = function (foodRushTime) {
    Order.setFoodRushTime(foodRushTime);
  };

  $scope.loadCart = function () {
    $scope.cart = Cart;
    $scope.foodRushTime.value = Order.getFoodRushTime() || 0;
    if (_.isEmpty(Cart.getProducts())) {
      $scope.messageBackdrop = {
        show: true,
        title: 'emptyCartTitle',
        details: 'emptyCartDetails',
        iconClasses: 'ion-ios-cart'
      };
    } else {
      $scope.messageBackdrop = MessageBackdrop.noBackdrop();
      $scope.isNewOrder.value = Order.isNewOrder();
    }
  };

  $scope.loadAddressInformation = function () {
    $scope.residencies = Address.getResidencies();
    PredefinedAddresses.get().then(function (predefinedAddresses) {
      $scope.predefinedAddresses = predefinedAddresses;
      return Address.get(Credentials.get().id);
    }).then(function (userAddress) {
      $scope.userAddress = {
        'residency': userAddress.residency,
        'details': userAddress.details,
        'latitude': userAddress.latitude,
        'longitude': userAddress.longitude,
        'street': userAddress.street
      };
      $scope.hasPredefinedPersonalAddress.value = _.isEmpty(userAddress.data);
      $scope.hasPredefinedPersonalAddress.hasValue = true;
    }).catch(function () {
      $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshGroupOrders()');
    });
  };

  $scope.onConfirmOrderTouch = function (ev) {
    $scope.validateOrder().then(function () {
      var productFormats = {};
      _.forEach(Cart.getProducts(), function (product) {
        _.forEach(product.formats, function (format) {
          if (format.quantity > 0) {
            productFormats[format.id] = format.quantity;
          }
        });
      });
      Order.setGroupOrderId(Order.getCurrentOrder().groupOrderId);
      Order.setFoodRushTime($scope.foodRushTime.value);
      Order.setProductFormats(productFormats);
      Order.setComment($scope.comment.value);
      $mdDialog.show({
        targetEvent: ev,
        templateUrl: 'templates/popups/ask-for-address.html',
        scope: $scope,
        preserveScope: true,
        clickOutsideToClose: false,
        controller: 'CartCtrl'
      }).then(function () {
        $scope.loadingBackdrop = LoadingBackdrop.backdrop();
        $scope.validateAddress($scope.addressTypeSelected.value).then(function () {
          if ($scope.addressTypeSelected.value === 'myAddress') {
            var requestBodyAddress = Address.getAddressFromResidencyInformation($scope.userAddress.residency);
            Order.setStreet(requestBodyAddress.street);
            Order.setDetails($scope.userAddress.details);
            Order.setLatitude(requestBodyAddress.latitude);
            Order.setLongitude(requestBodyAddress.longitude);
          } else if ($scope.addressTypeSelected.value === 'newAddress') {
            /* TODO : get information from residency */
            var residencyInformations = Address.getAddressFromResidencyInformation($scope.deliveryAddress.value);
            Order.setStreet(residencyInformations.street);
            Order.setDetails($scope.deliveryAddress.value + ', ' + $scope.addressSupplement.value);
            Order.setLatitude(residencyInformations.latitude);
            Order.setLongitude(residencyInformations.longitude);
					}
					else if ($scope.addressTypeSelected.value === 'predefinedAddress')
					{
						_.forEach($scope.predefinedAddresses, function(predefinedAddress) {
							if (predefinedAddress.details === $scope.predefinedDeliveryAddress.value)
							{
								Order.setStreet(predefinedAddress.street);
								Order.setDetails(predefinedAddress.details);
								Order.setLatitude(predefinedAddress.latitude);
								Order.setLongitude(predefinedAddress.longitude);
							}
						});
					}
					return Order.save();
				})
				.then(function() {
					$scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
					Cart.reset();
					Order.resetCurrentOrder();
					$ionicHistory.clearCache();
					$state.go('app.group-orders');
					Popup.displayTitleOnly($translate('ordered'), 3000);
				})
				.catch(function(errorMessage) {
					$scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
					return Popup.displayError($translate(errorMessage), 5000);
				});
			});
		})
		.catch(function(errorMessage) {
			return Popup.displayError(errorMessage, 4000);
		});
	};

	$scope.closeAskForAddressDialog = function(cancel) {
		if(cancel)
		{
			$mdDialog.cancel();
		}
		else
		{
			$mdDialog.hide();
		}
	};

	$scope.validateOrder = function() {
		var deferred = $q.defer();
		if(Order.getCurrentOrder().groupOrderId === null && $scope.foodRushTime.value === 0)
		{
			deferred.reject($translate('missingFoodRushTime'));
		}
	  else
		{
			deferred.resolve();
		}
		return deferred.promise;
	};

	$scope.validateAddress = function() {
		/* TODO : validate address format ? */
		var deferred = $q.defer();
		deferred.resolve();
		return deferred.promise;
	};

	$scope.detectPlaceholder = function() {
		/*
		this function is called by ngChange when user interact with all inputs (mdSelect, mdInput)
		*/
    if ($scope.deliveryAddress.value === null) {
      $scope.deliveryAddress.hasValue = false;
    } else {
      $scope.deliveryAddress.hasValue = true;
    }
    if ($scope.addressSupplement.value === null || $scope.addressSupplement.value === '') {
      $scope.addressSupplement.hasValue = false;
    } else {
      $scope.addressSupplement.hasValue = true;
    }
    if ($scope.predefinedDeliveryAddress.value === null) {
      $scope.predefinedDeliveryAddress.hasValue = false;
    } else {
      $scope.predefinedDeliveryAddress.hasValue = true;
    }
    $scope.shouldAddressDialogConfirmButtonBeDisable();
  };

  $scope.shouldAddressDialogConfirmButtonBeDisable = function () {
    /*
		This function return true if the OK button of popup should be disabled,
		else false.
		Depends on which radio button is on (= which addressType has been
		selected), we check if a delivery address has been selected/entered
		*/
    var shouldBeDisable;
    if ($scope.addressTypeSelected.value === 'myAddress') {
      if ($scope.hasPredefinedPersonalAddress.hasValue) {
        if ($scope.hasPredefinedPersonalAddress.value) {
          shouldBeDisable = false;
        } else {
          shouldBeDisable = true;
        }
      } else {
        shouldBeDisable = true;
      }
    } else if ($scope.addressTypeSelected.value === 'newAddress') {
      if ($scope.deliveryAddress.hasValue && $scope.addressSupplement.hasValue) {
        shouldBeDisable = false;
      } else {
        shouldBeDisable = true;
      }
    } else if ($scope.addressTypeSelected.value === 'predefinedAddress') {
      if ($scope.predefinedDeliveryAddress.hasValue) {
        shouldBeDisable = false;
      } else {
        shouldBeDisable = true;
      }
    } else {
      shouldBeDisable = true;
    }
    return shouldBeDisable;
  };

  $scope.resetDeliveryAddress = function () {
    $scope.deliveryAddress.value = null;
    $scope.addressSupplement.value = null;
    $scope.predefinedDeliveryAddress.value = null;
    $scope.detectPlaceholder();
  };

	$scope.getDiscountPrice = function() {
		return $scope.cart.getTotalPrice() * (1 - Order.getCurrentDiscount()/100) ;
	};

	$scope.loadCart();
	$scope.loadAddressInformation();

  $scope.getTimeDiff = function (endingAt) {
    return Order.getTimeDiff(endingAt);
  };

});