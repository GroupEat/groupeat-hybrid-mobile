'use strict';

angular.module('groupeat.controllers.cart', ['groupeat.services.cart'])

.controller('CartCtrl', function($scope, $state, Cart) {

  $scope.cart = Cart.query();

  

  

});
