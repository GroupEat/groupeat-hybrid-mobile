'use strict';

angular.module('groupeat.controllers.restaurants', ['groupeat.services.restaurant'])

.controller('RestaurantsCtrl', function($scope, $state, Restaurant) {

  $scope.restaurants = Restaurant.get();

});
