'use strict';
angular.module('groupeat.controllers.restaurant-menu', [
  'groupeat.services.analytics',
  'groupeat.services.cart',
  'groupeat.services.lodash',
  'groupeat.services.loading-backdrop',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.order',
  'groupeat.services.product',
  'groupeat.services.popup',
  'ionic',
  'ngMaterial',
  'pascalprecht.translate'
]).controller('RestaurantMenuCtrl', function ($scope, $state, $stateParams, $filter, $mdDialog, Analytics, LoadingBackdrop, MessageBackdrop, Network, Product, Popup, Cart, $ionicNavBarDelegate, _, Order, $ionicHistory, $ionicScrollDelegate, $timeout) {
  var $translate = $filter('translate');
  Analytics.trackEvent('Restaurant', 'View', null, $stateParams.restaurantId);
  $scope.isNewOrder = { value: null };
  $scope.groups = [];
  $scope.initCart = function () {
    $scope.currentOrder = Order.getCurrentOrder();
    Cart.setDiscountRate($scope.currentOrder.currentDiscount);
    $scope.cart = Cart;
    $scope.isNewOrder.value = Order.isNewOrder();
  };
  $scope.onRefreshRestaurantMenu = function () {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop();
    if (!Network.hasConnectivity()) {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      return;
    }
    // Loading the menu of the restaurant
    Product.get($stateParams.restaurantId).then(function (products) {
      $scope.products = products;
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
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
      } else {
        $scope.messageBackdrop = MessageBackdrop.noBackdrop();
      }
    }).catch(function () {
      $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurantMenu()');
    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.toggleDetails = function (product) {
    if ($scope.areDetailsShown(product)) {
      $scope.detailedProduct = null;
    } else {
      $scope.detailedProduct = product;
    }
  };
  $scope.areDetailsShown = function (product) {
    return $scope.detailedProduct === product;
  };
  $scope.onDeleteProduct = function (product, formatIndex) {
    Cart.removeProduct(product, formatIndex);
  };
  $scope.onAddProduct = function (product, format) {
    if ($scope.cart.getTotalQuantity() >= $scope.currentOrder.remainingCapacity) {
      Popup.displayError($translate('tooManyProducts'), 3000);
    } else {
      Cart.addProduct(product, format);
    }
  };
  $scope.onLeaveRestaurant = function () {
    if (_.isEmpty($scope.cart.getProducts())) {
      Order.resetCurrentOrder();
      $ionicHistory.goBack();
    } else {
      var leaveOrder = $mdDialog.confirm().title($translate('leaveOrder')).content($translate('cartWillBeDestroyed')).ok($translate('ok')).cancel($translate('cancel'));
      $mdDialog.show(leaveOrder).then(function () {
        Cart.reset();
        Order.resetCurrentOrder();
        $ionicHistory.goBack();
      });
    }
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
  $scope.initCart();
  $scope.onRefreshRestaurantMenu();
});