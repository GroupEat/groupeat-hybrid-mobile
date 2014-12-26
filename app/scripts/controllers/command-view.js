'use strict';

angular.module('groupeat.controllers.command-view', [])

.controller('CommandViewCtrl', function($scope, $state) {

  $scope.shownGroup = null;

  /*
  accordion list
  */
  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };

    $scope.groups[i].items.push('infos sur le restaurant ' + i);
  }

  

  $scope.onNewCommandTap = function() {
    $state.go('food-choice');
  };

  /*
  * if given group is the selected group, deselect it
  * else, select the given group
  */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

});
