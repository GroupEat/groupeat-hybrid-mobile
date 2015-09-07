'use strict';

angular.module('groupeat.controllers.cart', [
  'ionic',
  'pascalprecht.translate',
  'groupeat.services.address',
  'groupeat.services.analytics',
  'groupeat.services.cart',
  'groupeat.services.credentials',
  'groupeat.services.order',
  'groupeat.services.popup',
  'groupeat.services.predefined-addresses'
])

.controller('CartCtrl', function ($filter, $ionicHistory, $ionicSlideBoxDelegate, $scope, $state, Address, Cart, Credentials, Order, PredefinedAddresses, Popup) {

  var $translate = $filter('translate');

  $scope.$on('modal.shown', function() {
    $scope.cart = Cart;
    $scope.comment = {value : ''};
    $scope.currentDiscount = Order.getCurrentDiscount();
    $scope.foodRushTime.value = Order.getFoodRushTime() || 0 ;
    PredefinedAddresses.get()
    .then(function(predifinedAddresses) {
      $scope.predifinedAddresses = predifinedAddresses;
    });
    Address.get(Credentials.get().id)
    .then(function(address) {
      $scope.presetAddress = address;
    });
  });

  $scope.slideIndex = 0;

  $scope.confirmButtons = [
    {title: 'Valider ma commande !', color: 'green'},
    {title: 'Valider mon adresse !', color: 'orange'}
  ];

  $scope.address = {
    name: 'preset',
    other: 0
  };

  $scope.activeButton = $scope.confirmButtons[0];

  $scope.slideHasChanged = function(index) {
    $scope.slideIndex = index;
    $scope.activeButton = $scope.confirmButtons[index];
  };

  $scope.closeCart = function() {
    $scope.modal.hide()
    .then(function() {
      $ionicSlideBoxDelegate.slide(0);
    });
  };

  $scope.confirmButtonAction = function() {
    if($scope.slideIndex === 0) {
      $ionicSlideBoxDelegate.slide(1);
    } else {
      if($scope.address.name === 'preset') {
        var requestDetails = Address.getAddressFromResidencyInformation($scope.presetAddress.residency);
        Order.setStreet(requestDetails.street);
        Order.setLatitude(requestDetails.latitude);
        Order.setLongitude(requestDetails.longitude);
        Order.setDetails($scope.presetAddress.details);
      } else {
        Order.setStreet($scope.predifinedAddresses[$scope.address.other].street);
        Order.setLatitude($scope.predifinedAddresses[$scope.address.other].latitude);
        Order.setLongitude($scope.predifinedAddresses[$scope.address.other].longitude);
        Order.setDetails($scope.predifinedAddresses[$scope.address.other].details);
      }
      Order.setComment($scope.comment.value);
      var requestProducts = {};
      angular.forEach(Cart.getProducts(), function(product) {
          requestProducts[product.id] = product.quantity;
      });
      Order.setProductFormats(requestProducts);
      Order.save()
      .then(function() {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        $scope.leaveOrder();
        $scope.modal.hide();
      })
      .catch(function (errorResponse) {
        Popup.confirm('missingProperties', errorResponse, 'exitOrder', 'cancel')
        .then(function(leaveOrder) {
          if(leaveOrder) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $scope.leaveOrder('settings');
            $scope.modal.hide();
          }
        });
      });
    }
  };

  $scope.leaveOrder = function(redirectState) {
    redirectState = redirectState || 'app.group-orders';
    Order.resetCurrentOrder();
    Cart.reset();
    $state.go(redirectState);
  };

});
