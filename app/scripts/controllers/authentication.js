'use strict';

angular.module('groupeat.controllers.authentication', [
  'ionic',
  'jcs-autoValidate',
  'ngMaterial',
  'pascalprecht.translate',
  'groupeat.services.authentication',
  'groupeat.services.customer',
  'groupeat.services.address',
  'groupeat.services.element-modifier',
  'groupeat.services.error-message-resolver',
  'groupeat.services.lodash',
  'groupeat.services.residency-utils'
])

.controller('AuthenticationCtrl', function($scope, $state, $ionicPopup, $mdDialog, $timeout, $q, $ionicModal, $filter, Customer, Address, ElementModifier, ResidencyUtils, Authentication, _) {

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
  $scope.userId = undefined;

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
          $mdDialog.show(
            $mdDialog.alert()
            .title($translate('whoops'))
            .content(errorMessage)
            .ok($translate('ok'))
          );
          $timeout(function() {
            $mdDialog.hide();
          }, 3000);
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
      Authentication.resource.getToken(null, $scope.userLogin).$promise.then(function(response) {

        var responseData = response.data;
        Authentication.setCredentials(responseData.id, responseData.token);

        $state.go('group-orders');

        return response;
      }, function(errorResponse) {
        $mdDialog.show(
          $mdDialog.alert()
          .title($translate('whoops'))
          .content(ElementModifier.errorMsgFromBackend(errorResponse))
          .ok($translate('ok'))
        );
        $timeout(function() {
          $mdDialog.hide();
        }, 3000);
        return errorResponse;
      });
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

      // TODO : Fetch proper locale
      var parameters = _.merge($scope.userRegister, {'locale': 'fr'});

      var customer = new Customer(parameters);
      customer.$save().then(function(response) {

        var responseData = response.data;
        $scope.userId = responseData.id;
        Authentication.setCredentials(responseData.id, responseData.token);

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
      }, function(errorResponse) {
        $mdDialog.show(
          $mdDialog.alert()
          .title($translate('whoops'))
          .content(ElementModifier.errorMsgFromBackend(errorResponse))
          .ok($translate('ok'))
        );
        $timeout(function() {
          $mdDialog.hide();
        }, 3000);
        return errorResponse;
      });
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

    var firstName = $scope.userRegister.firstName ? $scope.userRegister.firstName : '';
    var dialog = $mdDialog.show(
      $mdDialog.alert()
      .title($translate('welcome', {firstName: firstName}))
      .ok($translate('ok'))
    );
    $timeout(function() {
      $mdDialog.hide();
    }, 3000);

    return dialog;
  };

  $scope.$watch('[userRegister.firstName, userRegister.lastName, userRegister.phoneNumber, userRegister.residency]', function () {
    if ( ($scope.showFurtherRegisterForm && $scope.userRegister.firstName && $scope.userRegister.lastName && $scope.userRegister.phoneNumber && $scope.userRegister.residency) ) {
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

      var customerParams = _.pick($scope.userRegister, ['firstName', 'lastName', 'phoneNumber']);

      Customer.update({id : $scope.userId}, customerParams).$promise
      .then(function() {
        var addressParams = _.merge(Address.getAddressFromResidencyInformation(), {details: $scope.userRegister.addressSuplement});
        return Address.resource.update({id: $scope.userId}, addressParams).$promise;
      })
      .then(function() {
        $scope.onSkipFurtherRegisterButtonTouch();
      })
      .catch(function(errorResponse) {
        $mdDialog.show(
          $mdDialog.alert()
          .title($translate('whoops'))
          .content(ElementModifier.errorMsgFromBackend(errorResponse))
          .ok($translate('ok'))
        );
        $timeout(function() {
          $mdDialog.hide();
        }, 3000);
        return errorResponse;
      });
    });
  };

  /*
  -------------------    End Further Registering -------------------------
  */
});
