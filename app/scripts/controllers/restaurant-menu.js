'use strict';

angular.module('groupeat.controllers.restaurant-menu', [])

.controller('RestaurantMenuCtrl', function($scope, $ionicPopup, $timeout, $state, $stateParams) {

  $scope.discount = 0.8;

  $scope.products =
    [
      {
        name:'Pizza 1',
        price:10,
        description:'Tomate, mozzarella di bufala, roquette, tomate cerise, parmesan, foie gras',
      },
      {
        name:'Pizza 2',
        price:10,
        description:'plein de choses',
      },
      {
        name:'Pizza 3',
        price:10,
        description:'plein de choses',
      },
      {
        name:'Pizza 4',
        price:8.5,
        description:'plein de choses',
      },

    ];

  $scope.addToBasketPopup = function(product) {
    $scope.data = product;

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/addToBasketPopup.html',
      scope: $scope,
      title: $scope.data.name,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Ajouter</b>',
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