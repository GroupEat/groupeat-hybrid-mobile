'use strict';

angular.module('groupeat.controllers.authentication', [
  'ionic',
  'jcs-autoValidate',
  'groupeat.services.address',
  'groupeat.services.authentication',
  'groupeat.services.credentials',
  'groupeat.services.customer',
  'groupeat.services.customer-settings',
  'groupeat.services.customer-storage',
  'groupeat.services.device-assistant',
  'groupeat.services.element-modifier',
  'groupeat.services.error-message-resolver',
  'groupeat.services.ionic-user',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.popup',
])

.controller('AuthenticationCtrl', function (_, $ionicSlideBoxDelegate, $scope, $state, $stateParams, $timeout, Address, Authentication, Credentials, Customer, CustomerSettings, CustomerStorage, DeviceAssistant, ElementModifier, IonicUser, Network, Popup) {

  $scope.slideIndex = 0;
  $scope.user = {};
  $scope.isProcessingRequest = false;
  $scope.registering = true;

  Credentials.reset();
  CustomerStorage.reset();

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
    var customerId = null;
    Network.hasConnectivity()
    .then(function() {
      return ElementModifier.validate(form);
    })
    .then(function() {
      return Authentication.authenticate($scope.user);
    })
    .then(function (credentials) {
      customerId = credentials.id;
      IonicUser.set({
        id: credentials.id,
        email: $scope.user.email
      });
      Credentials.set(customerId, credentials.token);
      return Customer.get(customerId);
    })
    .then(function(customer) {
      CustomerStorage.setIdentity(customer);
      CustomerStorage.setActivated(customer.activated);
      return Address.get(customerId);
    })
    .then(function(address) {
      CustomerStorage.setAddress(address);
      return CustomerSettings.get(customerId);
    })
    .then(function(customerSettings) {
      CustomerStorage.setSettings(customerSettings);
      return DeviceAssistant.register();
    })
    .then(function() {
      $state.go('app.group-orders');
    })
    .catch(function(errorMessage) {
      return Popup.error(errorMessage);
    })
    .finally(function() {
      $scope.isProcessingRequest = false;
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
      IonicUser.set({
        id: credentials.id,
        email: $scope.user.email
      });
      CustomerStorage.setDefaultSettings();
      Credentials.set(credentials.id, credentials.token);
      $state.go('app.signup');
    })
    .catch(function(errorMessage) {
      Popup.error(errorMessage);
    })
    .finally(function() {
      $scope.isProcessingRequest = false;
    });
  };

});
