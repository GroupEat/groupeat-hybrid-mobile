'use strict';

angular.module('groupeat.controllers.authentication', [
  'ionic',
  'jcs-autoValidate',
  'groupeat.services.authentication',
  'groupeat.services.analytics',
  'groupeat.services.credentials',
  'groupeat.services.customer',
  'groupeat.services.customer-storage',
  'groupeat.services.device-assistant',
  'groupeat.services.element-modifier',
  'groupeat.services.error-message-resolver',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.popup',
])

.controller('AuthenticationCtrl', function (_, $filter, $ionicSlideBoxDelegate, $q, $scope, $state, $stateParams, $timeout, Analytics, Authentication, Credentials, Customer, CustomerStorage, DeviceAssistant, ElementModifier, Network, Popup) {

  Analytics.trackView('Authentication');

  $scope.slideIndex = 0;
  $scope.user = {};
  $scope.isProcessingRequest = false;
  $scope.registering = true;

  /* Analytics Timing */
  var d = new Date();
  $scope.initialTime = d.getTime();

  $scope.slideHasChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.slideTo = function(index) {
    $ionicSlideBoxDelegate.slide(index);
    $scope.slideIndex = index;
  };

  /* Setting the right slideIndex to avoid having to swipe when redirected to auth */
  $timeout(function() {
    $scope.slideTo($stateParams.slideIndex);
  }, 100);

  $scope.submitForm = function(form, registering) {
    if (registering) {
      $scope.submitRegisterForm(form);
    } else {
      $scope.submitLoginForm(form);
    }
  };

  $scope.submitLoginForm = function(form) {
    $scope.isProcessingRequest = true;
    Analytics.trackEvent('Authentication', 'Tries to Login');
    Network.hasConnectivity()
    .then(function() {
      return ElementModifier.validate(form);
    })
    .then(function() {
      return Authentication.authenticate($scope.user);
    })
    .then(function (credentials) {
      Credentials.set(credentials.id, credentials.token);
      Analytics.trackEvent('Authentication', 'Logs In');
      Analytics.trackTimingSinceTime('Authentication', $scope.initialTime, 'Time to Login');
      $scope.isProcessingRequest = false;
      $state.go('app.group-orders');
    })
    .catch(function(errorMessage) {
      $scope.isProcessingRequest = false;
      return Popup.error(errorMessage);
    });
  };

  $scope.submitRegisterForm = function(form) {
    $scope.isProcessingRequest = true;
    Network.hasConnectivity()
    .then(function() {
      return ElementModifier.validate(form);
    })
    .then(function() {
      // TODO : Fetch proper locale
      var requestBody = _.merge($scope.user, { 'locale': 'fr' });
      return Customer.save(requestBody);
    })
    .then(function(credentials) {
      CustomerStorage.setDefaultSettings();
      Credentials.set(credentials.id, credentials.token);
      return DeviceAssistant.register();
    })
    .then(function() {
      $scope.isProcessingRequest = false;
      $state.go('signup');
    })
    .catch(function(errorMessage) {
      $scope.isProcessingRequest = false;
      Popup.error(errorMessage);
    });
  };

});
