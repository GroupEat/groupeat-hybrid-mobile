'use strict';
angular.module('groupeat.controllers', [])

.controller('SideMenuController', function($scope, $ionicSideMenuDelegate, $state) {

    $scope.menu = [
        {
            'title'     : 'Commande en cours',
            'iconName'  : 'ion-fork',
            'action'    : 'onCommandTap()'
        },
        {
            'title'     : 'Favoris',
            'iconName'  : 'ion-heart',
            'action'    : 'onFavoritesTap()'
        },
        {
            'title'     : 'Réglages',
            'iconName'  : 'ion-ios7-settings-strong',
            'action'    : 'onSettingsTap()'
        }
  ];

    $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.onNavBarMenuButtonTap = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.onCommandTap = function() {
		$state.go('current-command');
		$ionicSideMenuDelegate.toggleLeft(false);
	};

	$scope.onSettingsTap = function() {
		$state.go('settings');
		$ionicSideMenuDelegate.toggleLeft(false);
	};

	$scope.onFavoritesTap = function() {
		$state.go('favorites');
		$ionicSideMenuDelegate.toggleLeft(false);
	};

})

.controller('CommandViewController', function($scope, $state, $ionicSideMenuDelegate) {

	$ionicSideMenuDelegate.canDragContent(true);
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

})

.controller('FirstPageViewController', function($scope, $state, $ionicSideMenuDelegate) {
	 $ionicSideMenuDelegate.canDragContent(false) ;

	 $scope.onAccessTap = function() {
	 	$state.go('current-command');
	 }
	 
})

.controller("GoogleLoginController", function($scope, $cordovaOauth) {

    $scope.googleLogin = function() {
        $cordovaOauth.google("CLIENT_ID_HERE", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
            console.log(JSON.stringify(result));
        }, function(error) {
            console.log(error);
        });
    }

});