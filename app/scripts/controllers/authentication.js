'use strict';

angular.module('groupeat.controllers.authentication', ['groupeat.services.customer'])

.controller('AuthenticationCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicModal, $filter, Customer) {

  var $translate = $filter('translate');

  /*
  ----------------------    Initial View Controller    --------------------------
  */
  $scope.showLoginSignUpButtons = true ;

  $scope.onSignUpViewTouch = function() {
    $scope.showLoginSignUpButtons = false;
    $scope.showSignUpView = true ;
    $scope.showLoginBackButtonEnergized = false ;
    $scope.showLoginBackButtonAssertive = true ;
  };

  $scope.onLoginViewTouch = function() {
    $scope.showLoginSignUpButtons = false;
    $scope.showLoginView = true ;
    $scope.showLoginBackButtonEnergized = true ;
    $scope.showLoginBackButtonAssertive = false ;
    $scope.userLogin = {};
  };

  /*
  ----------------------    Login View Controller    --------------------------
  */
  /* onBackToMainViewButtonTouch is reused in First Register View */
  $scope.onBackToMainViewButtonTouch = function() {
    $scope.showLoginSignUpButtons = true;
    $scope.showLoginView = false ;
    $scope.showSignUpView = false ;
    $scope.showLoginBackButtonEnergized = false ;
    $scope.showLoginBackButtonAssertive = false ;
  };

  $scope.submitLoginForm = function(form) {
    // test de base de donnée backend à faire en plus de ceux faits en front
    if (form.$valid) {
      $state.go('orders');
    }
    else {
      var alertWrongCombinaison = $ionicPopup.alert({ // info to user : email sent
        title: $translate('wrongEmailPasswordCombination'),
        okText: 'OK',
        okType: 'button-energized',
      });
      $timeout(function() {
        alertWrongCombinaison.close(); //close the popup after 3 seconds
      }, 4000);
    }
  };

  $scope.showRestPasswordPopup = function() {
    $scope.userReset = {};
    $scope.tapChoice = {}; // quel choix fait sur la popup : cancel ou send ?


    $ionicPopup.show({
      title : '<h4 class="login-text-first-page border-less">'+$translate('resetPassword')+'</h4>' ,
      template: null,
      templateUrl: 'templates/resetPasswordPopup.html',
      scope: $scope,
      buttons: [{
        text: $translate('cancel'),
        type: 'button-outline button-energized',
        onTap: function() {
          close();
          $scope.tapChoice = $translate('cancel');
        }
      }, {
        text: $translate('send'),
        type: 'button-energized',
        onTap: function() {
          console.log($scope.userReset.email); // test console
          return $scope.userReset.email;
        }
      }]
    })
    .then(function() {
      if ($scope.tapChoice === $translate('cancel')) {

      }  // la popup se ferme sans rien faire d'autre
      else {
        if($scope.userReset.email === undefined) { // alert : email invalid
          var alertInvalidEmail = $ionicPopup.alert({
            title: $translate('invalidEmail'),
            okText: 'OK',
            okType: 'button-energized',
          });
          $timeout(function() {
            alertInvalidEmail.close(); //close the popup after 2 seconds
          }, 2000);
        }

        else {
          var alertPopup = $ionicPopup.alert({ // info to user : email sent
            title: ' <i>'+$translate('emailSentTo')+'</i> ' +  $scope.userReset.email  + '.',
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

  /*
  -------------------    END LOGIN VIEW   -------------------------
  */


  /*
  -------------------    FIRST REGISTER VIEW  (UNSKIPPABLE INFORMATIONS) -------------------------
  */
  $scope.userSignup = {};

  $scope.onSignUpTouch = function() {
    console.log('user email :' + $scope.userSignup.email); // test console
    console.log('user password :' + $scope.userSignup.password); // test console
    console.log('user passwordConfirmed :' + $scope.userSignup.passwordConfirmed); // test console

    // test de quels champs l'user a rentré ////
    if ($scope.userSignup.email === undefined) {
      var alertEnterEmail = $ionicPopup.alert({
        title: $translate('pleaseEnterEmail'),
        okText: 'OK',
        okType: 'button-assertive',
      });
      $timeout(function() {
        alertEnterEmail.close(); //close the popup after 2 seconds
      }, 2000);
    }

    else if ($scope.userSignup.password === undefined) {
      var alertEnterPassword = $ionicPopup.alert({
        title: $translate('pleaseEnterPassword'),
        okText: 'OK',
        okType: 'button-assertive',
      });
      $timeout(function() {
        alertEnterPassword.close(); //close the popup after 3 seconds
      }, 2000);
    }

    else if ($scope.userSignup.passwordConfirmed === undefined) {
      var alertConfirmPassword = $ionicPopup.alert({
        title: $translate('pleaseConfirmPassword'),
        okText: 'OK',
        okType: 'button-assertive',
      });
      $timeout(function() {
        alertConfirmPassword.close(); //close the popup after 3 seconds
      }, 2000);
    }

    // Test password identique
    else if ($scope.userSignup.password !== $scope.userSignup.passwordConfirmed ) {
      var alertDifferentPasswords = $ionicPopup.alert({
        title: $translate('passwordDoNotMatch'),
        okText: 'OK',
        okType: 'button-assertive',
      });
      $timeout(function() {
        alertDifferentPasswords.close(); //close the popup after 3 seconds
      }, 3000);
    }
    // Tests backend à faire
    else if($scope.userSignup.email === 'groupeat@groupeat.fr') {
      var alertEmailAlreadyUsed = $ionicPopup.alert({
        title: $translate('emailAlreadyInUse'),
        okText: 'OK',
        okType: 'button-assertive',
      });
      $timeout(function() {
        alertEmailAlreadyUsed.close(); //close the popup after 3 seconds
      }, 2000);
    }



    else { // tout est ok
      var customer = new Customer($scope.userSignup);
      customer.$save();

      $scope.showLoginSignUpButtons = false;
      $scope.showLoginView = false ;
      $scope.showSignUpView = false ;
      $scope.showLoginBackButtonEnergized = false ;
      $scope.showLoginBackButtonAssertive = false ;
      $scope.showSecondFormView = true ;
      $scope.showSkipButton = true ;
    }

  };


  /*
  -------------------    END FIRST REGISTER VIEW  (UNSKIPPABLE INFORMATIONS) -------------------------
  */


  /*
  -------------------    SECOND REGISTER VIEW  (SKIPPABLE INFORMATIONS) -------------------------
  */
  $scope.onSkipSecondFormTouch = function () {
    $state.go('current-command') ;

    var alertWelcome = $ionicPopup.alert({
      title: $translate('welcomeMessage'),
      okText: 'OK',
      okType: 'button-assertive',
    });
    $timeout(function() {
      alertWelcome.close(); //close the popup after 3 seconds
    }, 3000);
  };

  $scope.$watch('[userSignup.firstName, userSignup.lastName, userSignup.phoneNumber, userSignup.address]', function () {
    if ( ($scope.userSignup.firstName && $scope.userSignup.lastName && $scope.userSignup.phoneNumber && $scope.userSignup.address) ) {
      $scope.showSecondRegisterButton = true;
      $scope.showSkipButton = false ;
    }
    else {
      $scope.showSecondRegisterButton = false;
      $scope.showSkipButton = true ;
    }
  }, true);

  $scope.onSecondRegisterTouch = function () {
    $state.go('current-command') ;

    var alertWelcome = $ionicPopup.alert({
      title: $translate('welcomeMessage'),
      okText: 'OK',
      okType: 'button-energized',
    });
    $timeout(function() {
      alertWelcome.close(); //close the popup after 3 seconds
    }, 3000);

  };

  /*
  -------------------    END SECOND REGISTER VIEW  (SKIPPABLE INFORMATIONS) -------------------------
  */


  /*
  ---------------- OTHERS, NOT USED FOR THE MOMENT, USEFULL LATER ---------------------
  */

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

  /*
  ---------------- OTHERS, NOT USED FOR THE MOMENT, USEFULL LATER ---------------------
  */

});
