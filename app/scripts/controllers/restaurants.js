'use strict';

angular.module('groupeat.controllers.restaurants', ['groupeat.services.restaurant'])

.controller('RestaurantsCtrl', function($rootScope, $scope, $state, Restaurant) {

  $scope.restaurants = Restaurant.query();

  $scope.goRestaurantMenu = function(restaurantId) {
	  $state.go('restaurant-menu', {restaurantId: restaurantId});
  };

});
