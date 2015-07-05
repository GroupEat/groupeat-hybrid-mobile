'use strict';

angular.module('groupeat.controllers.cart', [
  'groupeat.services.cart',
  'groupeat.services.order',
  'ionic'
])

.controller('CartCtrl', function ($ionicSlideBoxDelegate, $scope, Cart, Order) {

  $scope.$on('modal.shown', function() {
    $scope.cart = Cart;
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
      //Confirm Order
    }
  };

});
