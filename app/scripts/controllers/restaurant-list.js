'use strict';

angular.module('groupeat.controllers.restaurant-list', [])

.controller('RestaurantListCtrl', function($rootScope, $scope, $state) {
  
  $rootScope.restaurants = [
    {
      id:'1',
      restaurantname:'Di Genova',
      restaurantsections:
      [
        {
          id:'1',
          name:'Pizza base tomate',
          products:
          [
            {
              name:'Pizza 1',
              description:'plein de choses',
            },
            {
              name:'Pizza 2',
              description:'plein de choses',
            },
          ],
        },
        {
          id:'2',
          name:'Pizza base crème fraiche',
          products:
          [
            {
              name:'Pizza 1',
              description:'plein de choses',
            },
            {
              name:'Pizza 2',
              description:'plein de choses',
            },

          ]
        },
      ]
    },
  ];

  $scope.goRestaurantMenu = function(json) {
	  //console.log(json);
	  $state.go('restaurant-menu',{'sections':json});
  };

});
