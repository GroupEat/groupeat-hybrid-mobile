'use strict';

angular.module('groupeat.controllers.authentication', [
  'ionic',
  'jcs-autoValidate',
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

.controller('AuthenticationCtrl', function ($scope, $state, $timeout, $q, $filter, Address, Analytics, Authentication, Credentials, Customer, ElementModifier, Popup, DeviceAssistant, ResidencyUtils, _) {

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
  $scope.showSkipFurtherRegisterButton = false;
  $scope.showSubmitFurtherRegisterButton = false;
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

  /* Analytics Timing */

  var d = new Date();
  $scope.initialTime = d.getTime();

  /*
  ---------------------- Initial --------------------------
  */
  $scope.onRegisterButtonTouch = function () {
    $scope.showLoginAndRegisterButtons = false;
    $scope.showRegisterForm = true;
    $scope.showLoginEnergizedBackButton = false;
    $scope.showLoginAssertiveBackButton = true;
  };

  $scope.onLoginButtonTouch = function () {
    $scope.showLoginAndRegisterButtons = false;
    $scope.showLoginForm = true;
    $scope.showLoginEnergizedBackButton = true;
    $scope.showLoginAssertiveBackButton = false;
  };

  $scope.onBackToMainViewButtonTouch = function () {
    $scope.showLoginAndRegisterButtons = true;
    $scope.showLoginForm = false;
    $scope.showRegisterForm = false;
    $scope.showLoginEnergizedBackButton = false;
    $scope.showLoginAssertiveBackButton = false;
  };
  /*
  -------------------    End Initial   -------------------------
  */

  /*
  ----------------------    Login    --------------------------
  */
  $scope.submitLoginForm = function (form) {
    Analytics.trackEvent('Authentication', 'Tries to Login');
    ElementModifier.validate(form).then(function () {
      return Authentication.getToken($scope.userLogin);
    }).then(function (response) {
      var responseData = response.data;
      Credentials.set(responseData.id, responseData.token);
      Analytics.trackEvent('Authentication', 'Logs In');
      Analytics.trackTimingSinceTime('Authentication', $scope.initialTime, 'Time to Login');
      $state.go('app.group-orders');
      return response;
    })
    .catch(function(errorResponse) {
      return Popup.error(errorResponse);
    });
  };

  $scope.showResetPasswordDialog = function (ev) {
    // Resetting the relevant scope elements each time such a popup is created
    $scope.userReset = {};

    var onTap = function(e) {
      if (!$scope.userReset.email) {
        e.preventDefault();
      } else {
        Authentication.resetPassword($scope.userReset.email)
        .finally(function() {
          return true;
        });
      }
    };

    Popup.template('resetPassword', 'templates/popups/reset-password.html', $scope, onTap);
  };
  /*
  -------------------    End Login   -------------------------
  */

  /*
  -------------------    Registering  (Mandatory) -------------------------
  */
  $scope.submitRegisterForm = function (form) {
    return ElementModifier.validate(form)
    .then(function () {
      // TODO : Fetch proper locale
      var requestBody = _.merge($scope.userRegister, { 'locale': 'fr' });
      return Customer.save(requestBody);
    })
    .then(function (response) {
      var responseData = response.data;
      $scope.userId = responseData.id;
      Credentials.set(responseData.id, responseData.token);
      return DeviceAssistant.register();
    })
    .then(function (response) {
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
      Popup.error(errorResponse);
    });
  };
  /*
  -------------------    End Registering -------------------------
  */

  /*
  -------------------    Further Registering (Skippable) -------------------------
  */
  $scope.hasRegistered = function (skipped) {
    Analytics.trackEvent('Authentication', 'Registered', 'Skipped : ' + skipped);
    Analytics.trackTimingSinceTime('Authentication', $scope.initialTime, 'Time to Register', 'Skipped : ' + skipped);
    $state.go('app.group-orders');
    var firstName = $scope.userRegister.firstName ? $scope.userRegister.firstName : '';
    return Popup.title($translate('welcome', {firstName: firstName}));
  };

  $scope.$watch('[userRegister.firstName, userRegister.lastName, userRegister.phoneNumber, userRegister.residency]', function () {
    $scope.updateFurtherRegisterButton();
  }, true);

  $scope.updateFurtherRegisterButton = function () {
    if ($scope.showFurtherRegisterForm && $scope.userRegister.firstName && $scope.userRegister.lastName && $scope.userRegister.phoneNumber && $scope.userRegister.residency) {
      $scope.showSubmitFurtherRegisterButton = true;
      $scope.showSkipFurtherRegisterButton = false;
    } else if ($scope.showFurtherRegisterForm) {
      $scope.showSubmitFurtherRegisterButton = false;
      $scope.showSkipFurtherRegisterButton = true;
    }
  };

  $scope.submitFurtherRegisterForm = function (form) {
    Analytics.trackEvent('Authentication', 'Tries to Register');
    ElementModifier.validate(form).then(function () {
      var customerParams = _.pick($scope.userRegister, [
        'firstName',
        'lastName',
        'phoneNumber'
      ]);
      return Customer.update({ id: $scope.userId }, customerParams);
    }).then(function () {
      var addressParams = _.merge(Address.getAddressFromResidencyInformation($scope.userRegister.residency), { details: $scope.userRegister.addressSuplement });
      return Address.update({ id: $scope.userId }, addressParams);
    }).then(function () {
      $scope.hasRegistered(false);
    })
    .catch(function(errorMessage) {
      return Popup.error(errorMessage);
    });
  };
  /*
  -------------------    End Further Registering -------------------------
  */

});
