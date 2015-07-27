'use strict';

angular.module('groupeat.controllers.cart', [
  'pascalprecht.translate',
  'groupeat.services.address',
  'groupeat.services.analytics',
  'groupeat.services.cart',
  'groupeat.services.credentials',
  'groupeat.services.order',
  'groupeat.services.predefined-addresses'
])

.controller('CartCtrl', function ($scope, $ionicSlideBoxDelegate, Cart, Order, Address, Credentials, $state) {

  $scope.$on('modal.shown', function() {
    $scope.cart = Cart;
    $scope.comment = {value : ''};
    $scope.currentDiscount = Order.getCurrentDiscount();
    $scope.foodRushTime.value = Order.getFoodRushTime() || 0 ;
  });



  $scope.slideIndex = 0;

  $scope.confirmButtons = [
    {title: 'Valider ma commande !', color: 'green'},
    {title: 'Valider mon adresse !', color: 'orange'}
  ];

  $scope.address = {
    name: 'preset',
    other: 'foyer'
  };

  $scope.activeButton = $scope.confirmButtons[0];

  $scope.slideHasChanged = function(index) {
    $scope.slideIndex = index;
    $scope.activeButton = $scope.confirmButtons[index];
  };

  $scope.confirmButtonAction = function() {
    if($scope.slideIndex === 0) {
      $ionicSlideBoxDelegate.slide(1);
    } else {
      if($scope.address.name === 'preset') {
        Address.get(Credentials.get().id).then(function(address) {
          var requestDetails = Address.getAddressFromResidencyInformation(address.residency);
          Order.setStreet(requestDetails.street);
          Order.setLatitude(requestDetails.latitude);
          Order.setLongitude(requestDetails.longitude);
          Order.setDetails(address.details);
          Order.setComment($scope.comment.value);
          var requestProducts = {};
          angular.forEach(Cart.getProducts(), function(product) {
              requestProducts[product.id] = product.quantity;
          });
          Order.setProductFormats(requestProducts);
          Order.save().then(function() {
            $state.go('app.group-orders');
          });
        });

      } else {

      }
    }
  };

});