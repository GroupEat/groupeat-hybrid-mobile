'use strict';

angular.module('groupeat.controllers.cart', [
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

.controller('CartCtrl', function ($scope, $ionicSlideBoxDelegate, Cart, Order) {

  $scope.$on('modal.shown', function() {
    $scope.cart = Cart;
    $scope.currentDiscount = Order.getCurrentDiscount();
    $scope.foodRushTime.value = Order.getFoodRushTime() || 0 ;
  });

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