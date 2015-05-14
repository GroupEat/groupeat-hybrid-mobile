'use strict';

angular.module('groupeat.controllers.authentication', [
  'ionic',
  'jcs-autoValidate',
  'ngMaterial',
  'pascalprecht.translate',
  'groupeat.services.address',
  'groupeat.services.authentication',
  'groupeat.services.analytics',
  'groupeat.services.credentials',
  'groupeat.services.customer',
  'groupeat.services.device-assistant',
  'groupeat.services.element-modifier',
  'groupeat.services.error-message-resolver',
  'groupeat.services.lodash',
  'groupeat.services.popup',
  'groupeat.services.residency-utils'
])

.controller('AuthenticationCtrl', function($scope, $state, $mdDialog, $timeout, $q, $filter, Address, Analytics, Authentication, Credentials, Customer, ElementModifier, Popup, DeviceAssistant, ResidencyUtils, _) {

  var $translate = $filter('translate');

  Analytics.trackView('Authentication');

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
  $scope.userId = undefined;

  /* Residencies options */
  $scope.residencies = Address.getResidencies();

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

  $scope.submitLoginForm = function(form) {
    ElementModifier.validate(form)
    .then(function() {
      return Authentication.getToken($scope.userLogin);
    })
    .then(function(response) {
      var responseData = response.data;
      Credentials.set(responseData.id, responseData.token);

      $state.go('side-menu.group-orders');

      return response;
    })
    .catch(function(errorResponse) {
      return Popup.displayError(errorResponse, 3000);
    });
  };

  $scope.showResetPasswordDialog = function(ev) {
    // Resetting the relevant scope elements each time such a popup is created
    $scope.userReset = {};
    $mdDialog.show({
      targetEvent: ev,
      parent: angular.element(document.body),
      templateUrl: 'templates/popups/reset-password.html',
      controller: 'AuthenticationCtrl',
      disableParentScroll: false
    });
  };

  $scope.closeResetPasswordDialog = function(form, cancel) {
    return (cancel) ? $mdDialog.hide() : ElementModifier.validate(form)
    .then(function() {
      Authentication.resetPassword($scope.userReset.email)
      .then(function() {
        $mdDialog.hide();
      })
      .catch(function(errorKey) {
        form.email.$setValidity(errorKey, false);
      });
    });
  };

  $scope.resetNotFoundValidity = function(form) {
    if (form.email.$error.notFound)
    {
      form.email.$setValidity('notFound', true);
    }
  };

  /*
  -------------------    End Login   -------------------------
  */

  /*
  -------------------    Registering  (Mandatory) -------------------------
  */

  $scope.submitRegisterForm = function(form) {
    return ElementModifier.validate(form)
    .then(function() {
      // TODO : Fetch proper locale
      var requestBody = _.merge($scope.userRegister, {'locale': 'fr'});
      return Customer.save(requestBody);
    })
    .then(function(response) {
      var responseData = response.data;
      $scope.userId = responseData.id;
      Credentials.set(responseData.id, responseData.token);
      return DeviceAssistant.register();
    })
    .then(function(response) {
      $scope.userRegister.residency = ResidencyUtils.getDefaultResidencyValueFromEmail($scope.userRegister.email);

      $scope.showLoginAndRegisterButtons = false;
      $scope.showLoginForm = false;
      $scope.showRegisterForm = false;
      $scope.showLoginEnergizedBackButton = false;
      $scope.showLoginAssertiveBackButton = false;
      $scope.showFurtherRegisterForm = true;
      $scope.showSubmitFurtherRegisterButton = false;
      $scope.showSkipFurtherRegisterButton = true;

      return response;
    })
    .catch(function(errorResponse) {
      Popup.displayError(errorResponse);
    });
  };


  /*
  -------------------    End Registering -------------------------
  */


  /*
  -------------------    Further Registering (Skippable) -------------------------
  */
  $scope.onSkipFurtherRegisterButtonTouch = function () {
    $state.go('side-menu.group-orders') ;
    var firstName = $scope.userRegister.firstName ? $scope.userRegister.firstName : '';
    return Popup.displayTitleOnly($translate('welcome', {firstName: firstName}), 3000);
  };

  $scope.$watch('[userRegister.firstName, userRegister.lastName, userRegister.phoneNumber, userRegister.residency]', function () {
    $scope.updateFurtherRegisterButton();
  }, true);

  $scope.updateFurtherRegisterButton = function() {
    if ( ($scope.showFurtherRegisterForm && $scope.userRegister.firstName && $scope.userRegister.lastName && $scope.userRegister.phoneNumber && $scope.userRegister.residency) ) {
      $scope.showSubmitFurtherRegisterButton = true;
      $scope.showSkipFurtherRegisterButton = false ;
    }
    else if ($scope.showFurtherRegisterForm) {
      $scope.showSubmitFurtherRegisterButton = false;
      $scope.showSkipFurtherRegisterButton = true ;
    }
  };

  $scope.submitFurtherRegisterForm = function(form) {
    ElementModifier.validate(form)
    .then(function() {
      var customerParams = _.pick($scope.userRegister, ['firstName', 'lastName', 'phoneNumber']);
      return Customer.update({id : $scope.userId}, customerParams);
    })
    .then(function() {
      var addressParams = _.merge(Address.getAddressFromResidencyInformation($scope.userRegister.residency), {details: $scope.userRegister.addressSuplement});
      return Address.update({id: $scope.userId}, addressParams);
    })
    .then(function() {
      $scope.onSkipFurtherRegisterButtonTouch();
    })
    .catch(function(errorMessage) {
      return Popup.displayError(errorMessage, 3000);
    });
  };

  /*
  -------------------    End Further Registering -------------------------
  */
});
