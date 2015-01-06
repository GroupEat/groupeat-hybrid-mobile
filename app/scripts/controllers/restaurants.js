'use strict';

angular.module('groupeat.controllers.restaurants', ['groupeat.services.restaurant'])

.controller('RestaurantsCtrl', function($rootScope, $scope, $state, Restaurant) {

  $scope.restaurants = Restaurant.query();

});
