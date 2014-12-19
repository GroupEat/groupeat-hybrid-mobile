'use strict';
angular.module('groupeat.controllers', [])

.controller('BottomTabsMenuController', function($scope, $state) {

	$scope.bottomTab = [
		{
			'title'     : 'Commandes',
			'iconName'  : 'ion-fork',
			'action'    : 'onCommandTap()'
		},
		{
			'title'     : 'Réglages',
			'iconName'  : 'ion-gear-a',
			'action'    : 'onSettingsTap()'
		}
	];

	$scope.onCommandTap = function() {
		$state.go('current-command');
	};

	$scope.onSettingsTap = function() {
		$state.go('settings');
	};
})

.controller('CommandViewController', function($scope, $state) {

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

	/*
	settings list
	*/
	$scope.settings = [];
	for (var j=0; j<4; j++) {
		$scope.settings[j] = {
			name: j,
			items: []
		};

		$scope.groups[j].items.push('Réglage ' + j);
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

.controller('FirstPageViewController', function($scope, $state, $ionicPopup, $timeout, $ionicModal) {

	$scope.userSignup = {};

	$scope.onAccessTouch = function (){
		$state.go('current-command');
	};

	$scope.ShowLoginSignUpButtons = true ;

	$scope.onLoginViewTouch = function() {
		$scope.ShowLoginSignUpButtons = false;
		$scope.ShowLoginView = true ;
		$scope.ShowLoginBackButtonEnergized = true ;
		$scope.ShowLoginBackButtonAssertive = false ;
		$scope.userLogin = {};
	};

	$scope.onLoginBackButtonTouch = function() {
		$scope.ShowLoginSignUpButtons = true;
		$scope.ShowLoginView = false ;
		$scope.ShowSignUpView = false ;
		$scope.ShowLoginBackButtonEnergized = false ;
		$scope.ShowLoginBackButtonAssertive = false ;
	};

	$scope.onSignUpViewTouch = function() {
		$scope.ShowLoginSignUpButtons = false;
		$scope.ShowSignUpView = true ;
		$scope.ShowLoginBackButtonEnergized = false ;
		$scope.ShowLoginBackButtonAssertive = true ;
	};

	$scope.onLoginTouch = function() {

		// test de base de donnée backend à faire
		if (($scope.userLogin.email === 'groupeat@groupeat.fr') && ($scope.userLogin.password === 'groupeat')) {
			$state.go('current-command');
		}
		else {
			console.log($scope.userLogin.email); // test console
			var alertWrongCombinaison = $ionicPopup.alert({ // info to user : email sent
				title: 'Mauvaise combinaison e-mail/mot de passe. <br> Essaie groupeat@groupeat.fr et mdp : groupeat.',
				okText: 'OK',
				okType: 'button-energized',
			});
			$timeout(function() {
					      alertWrongCombinaison.close(); //close the popup after 3 seconds
							}, 4000);
		}
	};


	$ionicModal.fromTemplateUrl('templates/modal/signUpModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	})
	.then(function(modal) {
		$scope.signUpModal = modal;
	});

	$scope.openSignUpModal = function() {
		$scope.signUpModal.show();
		$scope.userSignup = {};

	};
	$scope.closeSignUpModal = function() {
		$scope.signUpModal.hide();
	};


	$scope.onSignUpTouch = function() {
		console.log('user email :' + $scope.userSignup.email); // test console
		console.log('user password :' + $scope.userSignup.password); // test console
		console.log('user passwordConfirmed :' + $scope.userSignup.passwordConfirmed); // test console

		// test de quels champs l'user a rentré ////
		if ($scope.userSignup.email === undefined) {
			var alertEnterEmail = $ionicPopup.alert({
				title: 'Please enter an email.',
				okText: 'OK',
				okType: 'button-assertive',
			});
			$timeout(function() {
					      alertEnterEmail.close(); //close the popup after 2 seconds
							}, 2000);
		}

		else if ($scope.userSignup.password === undefined) {
			var alertEnterPassword = $ionicPopup.alert({
				title: 'Please enter a password.',
				okText: 'OK',
				okType: 'button-assertive',
			});
			$timeout(function() {
					      alertEnterPassword.close(); //close the popup after 3 seconds
							}, 2000);
		}

		else if ($scope.userSignup.passwordConfirmed === undefined) {
			var alertConfirmPassword = $ionicPopup.alert({
				title: 'Please confirm password.',
				okText: 'OK',
				okType: 'button-assertive',
			});
			$timeout(function() {
					      alertConfirmPassword.close(); //close the popup after 3 seconds
							}, 2000);
		}

		// Test password identique
		else if ($scope.userSignup.password !== $scope.userSignup.passwordConfirmed ) {
			var alertDifferentPasswords = $ionicPopup.alert({ // info to user : email sent
				title: 'Password is not the same...',
				okText: 'OK',
				okType: 'button-assertive',
			});
			$timeout(function() {
					      alertDifferentPasswords.close(); //close the popup after 3 seconds
							}, 3000);
		}
		// Tests backend à faire
		else if($scope.userSignup.email === 'groupeat@groupeat.fr') {
			var alertEmailAlreadyUsed = $ionicPopup.alert({ // info to user : email sent
				title: 'Email already used, try another',
				okText: 'OK',
				okType: 'button-assertive',
			});
			$timeout(function() {
					      alertEmailAlreadyUsed.close(); //close the popup after 3 seconds
							}, 2000);
		}

		

		else { // tout est ok
			
			$scope.ShowLoginSignUpButtons = false;
			$scope.ShowLoginView = false ;
			$scope.ShowSignUpView = false ;
			$scope.ShowLoginBackButtonEnergized = false ;
			$scope.ShowLoginBackButtonAssertive = false ;
			$scope.ShowSecondFormView = true ;
			$scope.ShowSkipButton = true ;
		}

	};

	$scope.showRestPasswordPopup = function() {
		$scope.userReset = {}; // data reset du user
		$scope.tapChoice = {}; // quel choix fait sur la popup : cancel ou send ?


		$ionicPopup.show({
			title : '<h4 class="login-text-first-page border-less"> Reset Password </h4>' ,
			template: null /*'<input type="email" ng-model="userReset.email">'*/, // écrit ici pour empêcher une bar blanche ignoble
			templateUrl: 'templates/resetPasswordPopup.html',
			scope: $scope,
			buttons: [{
				text: 'Cancel',
				type: 'button-outline button-energized',
				onTap: function() {
					close();
					$scope.tapChoice = 'Cancel';
				}
			}, {
				text: 'Send',
				type: 'button-energized',
				onTap: function() {
					console.log($scope.userReset.email); // test console
					return $scope.userReset.email;
				}
			}]
		}).then(function() {
			if ($scope.tapChoice === 'Cancel') {}  // la popup se ferme sans rien faire d'autre

			else {
				if($scope.userReset.email === undefined) { // alert : email invalid
					var alertInvalidEmail = $ionicPopup.alert({
						title: 'Invalid email.',
						okText: 'OK',
						okType: 'button-energized',
					});
					$timeout(function() {
					      alertInvalidEmail.close(); //close the popup after 2 seconds
							}, 2000);
				}

				else {
					var alertPopup = $ionicPopup.alert({ // info to user : email sent
						title: ' <i> Email sent to </i>' +  $scope.userReset.email  + '.',
						okText: 'OK',
						okType: 'button-energized',
					});
					$timeout(function() {
					      alertPopup.close(); //close the popup after 3 seconds
							}, 3000);
				}
			}
		});
	};

	$scope.onSkipSecondFormTouch = function () {
		$state.go('current-command') ;

		var alertWelcome = $ionicPopup.alert({ // info to user : email sent
			title: 'Welcome to Groupeat, be ready to eat for nothing...',
			okText: 'OK',
			okType: 'button-assertive',
		});
		$timeout(function() {
		    alertWelcome.close(); //close the popup after 3 seconds
			}, 3000);
	};

	$scope.$watch('[userSignup.firstName, userSignup.lastName, userSignup.phoneNumber, userSignup.address]', function () {
		if ( ($scope.userSignup.firstName && $scope.userSignup.lastName && $scope.userSignup.phoneNumber && $scope.userSignup.address) ) {
			$scope.ShowSecondRegisterButton = true;
			$scope.ShowSkipButton = false ;
		}
		else {
			$scope.ShowSecondRegisterButton = false;
			$scope.ShowSkipButton = true ;
		}
	}, true);

	$scope.onSecondRegisterTouch = function () {
		$state.go('current-command') ;
	
		var alertWelcome = $ionicPopup.alert({ // info to user : email sent
			title: 'Welcome to Groupeat, be ready to eat for nothing...',
			okText: 'OK',
			okType: 'button-energized',
		});
		$timeout(function() {
		    alertWelcome.close(); //close the popup after 3 seconds
			}, 3000);
		
	};
	
});

