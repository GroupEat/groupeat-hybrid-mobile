'use strict';

angular.module('groupeat.controllers.restaurant-menu', ['groupeat.services.pizza'])

.controller('RestaurantMenuCtrl', function($scope, $ionicPopup, $timeout, $state, $stateParams, $filter, Pizza) {

  var $translate = $filter('translate');

  $scope.discount = 0.8;

  $scope.pizzas = Pizza.query({restaurantId: $stateParams.restaurantId});

  $scope.getTotal = function(product){
    var total = 0;
    for(var i = 0; i < product.length; i++){
      var format = product[i];
      total += (format.price * format.quantity);
    }
    return total;
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
            text: 'ajouter',
            type: 'button-positive',
            onTap: function() {
            }
          }
        ]
      });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
  };


});
