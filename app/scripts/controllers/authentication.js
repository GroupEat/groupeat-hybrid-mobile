'use strict';

angular.module('groupeat.controllers.authentication', ['groupeat.services.customer', 'groupeat.services.element-modifier'])

.controller('AuthenticationCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicModal, $filter, Customer, ElementModifier) {

  var $translate = $filter('translate');

  /*
  ----------------------    Initial View Controller    --------------------------
  */
  $scope.showLoginSignUpButtons = true;
  $scope.showRegisterView = false;
  $scope.showLoginBackButtonEnergized = false;
  $scope.showLoginBackButtonAssertive = false;

  $scope.userRegister = {};
  $scope.userLogin = {};
  $scope.userReset = {};
  $scope.tapChoice = {}; // quel choix fait sur la popup : cancel ou send ?

  $scope.onRegisterButtonTouch = function() {
    $scope.showLoginSignUpButtons = false;
    $scope.showRegisterView = true;
    $scope.showLoginBackButtonEnergized = false;
    $scope.showLoginBackButtonAssertive = true;
  };

  $scope.onLoginButtonTouch = function() {
    $scope.showLoginSignUpButtons = false;
    $scope.showLoginView = true;
    $scope.showLoginBackButtonEnergized = true;
    $scope.showLoginBackButtonAssertive = false;
  };

  /*
  ----------------------    Login View Controller    --------------------------
  */
  /* onBackToMainViewButtonTouch is reused in First Register View */
  $scope.onBackToMainViewButtonTouch = function() {
    $scope.showLoginSignUpButtons = true;
    $scope.showLoginView = false ;
    $scope.showRegisterView = false ;
    $scope.showLoginBackButtonEnergized = false ;
    $scope.showLoginBackButtonAssertive = false ;
  };

  $scope.submitLoginForm = function(form) {
    if (form.$invalid) {
      var alertWrongCombinaison = $ionicPopup.alert({ // info to user : email sent
        title: ElementModifier.errorMsg(),
        okText: 'OK',
        okType: 'button-energized',
      });
      $timeout(function() {
        alertWrongCombinaison.close(); // close the popup after 3 seconds
      }, 4000);
    }
    else {
      $state.go('orders');
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
        onTouch: function() {
          close();
          $scope.tapChoice = 'cancel';
        }
      }, {
        text: $translate('send'),
        type: 'button-energized',
        onTouch: function() {
          return $scope.userReset.email;
        }
      }]
    })
    .then(function() {
      if ($scope.tapChoice === 'cancel') {

      }
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

  $scope.submitRegisterForm = function(form) {

    if (form.$invalid) {
      var alertWrongCombinaison = $ionicPopup.alert({
        title: ElementModifier.errorMsg(),
        okText: 'OK',
        okType: 'button-energized',
      });
      $timeout(function() {
        alertWrongCombinaison.close();
      }, 4000);
    }

    else {
      var customer = new Customer($scope.userRegister);
      customer.$save();

      $scope.showLoginSignUpButtons = false;
      $scope.showLoginView = false ;
      $scope.showRegisterView = false ;
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
    $state.go('orders') ;

    var alertWelcome = $ionicPopup.alert({
      title: $translate('welcomeMessage'),
      okText: 'OK',
      okType: 'button-assertive',
    });
    $timeout(function() {
      alertWelcome.close(); //close the popup after 3 seconds
    }, 3000);
  };

  $scope.$watch('[userRegister.firstName, userRegister.lastName, userRegister.phoneNumber, userRegister.address]', function () {
    if ( ($scope.userRegister.firstName && $scope.userRegister.lastName && $scope.userRegister.phoneNumber && $scope.userRegister.address) ) {
      $scope.showSecondRegisterButton = true;
      $scope.showSkipButton = false ;
    }
    else {
      $scope.showSecondRegisterButton = false;
      $scope.showSkipButton = true ;
    }
  }, true);

  $scope.onSecondRegisterTouch = function () {
    $state.go('orders') ;

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

  $ionicModal.fromTemplateUrl('templates/modal/register.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
  .then(function(modal) {
    $scope.registerModal = modal;
  });

  $scope.openRegisterModal = function() {
    $scope.registerModal.show();
    $scope.userRegister = {};

  };
  $scope.closeRegisterModal = function() {
    $scope.registerModal.hide();
  };

  /*
  ---------------- OTHERS, NOT USED FOR THE MOMENT, USEFUL LATER ---------------------
  */

});
