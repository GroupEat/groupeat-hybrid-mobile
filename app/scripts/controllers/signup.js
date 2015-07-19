'use strict';

angular.module('groupeat.controllers.signup', [])

.controller('SignupCtrl', function ($scope, $ionicSlideBoxDelegate) {
  
  $scope.slideIndex = 0;
  $scope.address = 0;

  $scope.slideTo = function(index) {
    $ionicSlideBoxDelegate.slide(index);
    $scope.slideIndex = index;
  };

});
