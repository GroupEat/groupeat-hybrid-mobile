'use strict';

angular.module('groupeat.controllers.restaurant-menu', ['groupeat.services.pizza'])

.controller('RestaurantMenuCtrl', function($scope, $ionicPopup, $timeout, $state, $stateParams, $filter, Pizza) {

  var $translate = $filter('translate');

  $scope.discount = 0.8;

  $scope.pizzas = Pizza.query({restaurantId: $stateParams.restaurantId});

  $scope.onCartTouch = function() {
    $state.go('cart');
  };

  $scope.addToBasketPopup = function(product) {
    $scope.data = product;

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/addToBasketPopup.html',
      scope: $scope,
      title: $scope.data.name,
      buttons: [
        { text: $translate('cancel') },
        {
            text: '<b>'+$translate('add')+'</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          }
        ]
      });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  };
  
});
