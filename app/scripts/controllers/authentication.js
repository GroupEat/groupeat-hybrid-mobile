'use strict';

angular.module('groupeat.controllers.authentication', ['groupeat.services.customer', 'groupeat.services.element-modifier'])

.controller('AuthenticationCtrl', function($scope, $state, $ionicPopup, $timeout, $q, $ionicModal, $filter, Customer, ElementModifier, ResidencyUtils) {

  var $translate = $filter('translate');

  /**
  Scope Initializations
  **/

  /* Showing DOM Elements */
  // Buttons
  $scope.showLoginAndRegisterButtons = true;
  $scope.showLoginEnergizedBackButton = false;
  $scope.showLoginAssertiveBackButton = false;
  $scope.showSkipFurtherRegisterButton = false ;
  $scope.showSubmitFurtherRegisterButton = false ;
  // Forms
  $scope.showLoginForm = false;
  $scope.showRegisterForm = false;
  $scope.showFurtherRegisterForm = false;

  /* Models */
  $scope.userLogin = {};
  $scope.userReset = {};
  $scope.userRegister = {};

  $scope.validationError = undefined;

  /*
  ---------------------- Initial --------------------------
  */

  $scope.onRegisterButtonTouch = function() {
    $scope.showLoginAndRegisterButtons = false;
    $scope.showRegisterForm = true;
    $scope.showLoginEnergizedBackButton = false;
    $scope.showLoginAssertiveBackButton = true;
  };

  $scope.onLoginButtonTouch = function() {
    $scope.showLoginAndRegisterButtons = false;
    $scope.showLoginForm = true;
    $scope.showLoginEnergizedBackButton = true;
    $scope.showLoginAssertiveBackButton = false;
  };

  $scope.onBackToMainViewButtonTouch = function() {
    $scope.showLoginAndRegisterButtons = true;
    $scope.showLoginForm = false ;
    $scope.showRegisterForm = false ;
    $scope.showLoginEnergizedBackButton = false ;
    $scope.showLoginAssertiveBackButton = false ;
  };

  /*
  -------------------    End Initial   -------------------------
  */

  /*
  ----------------------    Login    --------------------------
  */

  $scope.validateForm = function(form) {
    var deferred = $q.defer();
    $timeout(function() {
        if (form.$invalid)
        {
          var errorMessage = ElementModifier.errorMsg(form.$name);
          var alertWrongCombinaison = $ionicPopup.alert({
            title: errorMessage,
            okText: 'OK',
            okType: 'button-energized',
          });
          $timeout(function() {
            alertWrongCombinaison.close();
          }, 4000);
          deferred.reject(new Error(errorMessage));
        }
        else
        {
          deferred.resolve();
        }
      });
    return deferred.promise;
  };

  $scope.submitLoginForm = function(form) {
    $scope.validateForm(form).then(function() {
      $state.go('group-orders');
    });
  };

  $scope.showResetPasswordPopup = function() {
    // Resetting the relevant scope elements each time such a popup is created
    $scope.userReset = {};
    $scope.validationError = undefined;
    return $ionicPopup.show({
      title : $translate('resetPassword'),
      template: null,
      templateUrl: 'templates/popups/reset-password.html',
      scope: $scope,
      buttons: [
        { text: $translate('cancel') },
        {
          text: '<b>'+$translate('ok')+'</b>',
          type: 'button-outline button-energized',
          onTap: function(e) {
            if (ElementModifier.errorMsg('resetForm')) {
              $scope.validationError = ElementModifier.errorMsg('resetForm');
              e.preventDefault();
            } else {
              // TODO Run Back-End Request
              return $scope.userReset.email;
            }
          }
        }
      ]
    });
  };

  /*
  -------------------    End Login   -------------------------
  */

  /*
  -------------------    Registering  (Mandatory) -------------------------
  */

  $scope.submitRegisterForm = function(form) {
    return $scope.validateForm(form).then(function() {
      var customer = new Customer($scope.userRegister);
      customer.$save();

      $scope.userRegister.residency = ResidencyUtils.getDefaultResidencyValueFromEmail($scope.userRegister.email);

      $scope.showLoginAndRegisterButtons = false;
      $scope.showLoginForm = false;
      $scope.showRegisterForm = false;
      $scope.showLoginEnergizedBackButton = false;
      $scope.showLoginAssertiveBackButton = false;
      $scope.showFurtherRegisterForm = true;
      $scope.showSubmitFurtherRegisterButton = false;
      $scope.showSkipFurtherRegisterButton = true;
    });
  };


  /*
  -------------------    End Registering -------------------------
  */


  /*
  -------------------    Further Registering (Skippable) -------------------------
  */
  $scope.onSkipFurtherRegisterButtonTouch = function () {
    $state.go('group-orders') ;

    var alertWelcome = $ionicPopup.alert({
      title: $translate('welcomeMessage'),
      okText: 'OK',
      okType: 'button-assertive',
    });
    $timeout(function() {
      alertWelcome.close();
    }, 3000);
    return alertWelcome;
  };

  $scope.$watch('[userRegister.firstName, userRegister.lastName, userRegister.phoneNumber, userRegister.address]', function () {
    if ( ($scope.showFurtherRegisterForm && $scope.userRegister.firstName && $scope.userRegister.lastName && $scope.userRegister.phoneNumber && $scope.userRegister.address) ) {
      $scope.showSubmitFurtherRegisterButton = true;
      $scope.showSkipFurtherRegisterButton = false ;
    }
    else if ($scope.showFurtherRegisterForm) {
      $scope.showSubmitFurtherRegisterButton = false;
      $scope.showSkipFurtherRegisterButton = true ;
    }
  }, true);

  $scope.submitFurtherRegisterForm = function(form) {
    $scope.validateForm(form).then(function() {
      $scope.onSkipFurtherRegisterButtonTouch();
    });
  };

  /*
  -------------------    End Further Registering -------------------------
  */
});
