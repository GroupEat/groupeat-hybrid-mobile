'use strict';

angular.module('groupeat.controllers.signup', [
  'groupeat.services.address',
  'groupeat.services.credentials',
  'groupeat.services.customer',
  'groupeat.services.customer-storage',
  'groupeat.services.device-assistant',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.phone-format',
  'groupeat.services.popup',
  'ionic'
])

.controller('SignupCtrl', function (_, $ionicSlideBoxDelegate, $scope, $state, Address, Credentials, Customer, CustomerStorage, DeviceAssistant, Network, Popup) {

  $scope.slideIndex = 0;
  $scope.user = {};
  $scope.residencies = Address.getResidencies();

  $scope.slideTo = function(index) {
    $ionicSlideBoxDelegate.slide(index);
    $scope.slideIndex = index;
  };

  $scope.confirmSignup = function() {
    Network.hasConnectivity()
    .then(function() {
      var customerId = Credentials.get().id;
      var customerParams = _.pick($scope.user, ['firstName', 'lastName', 'phoneNumber']);
      return Customer.update(customerId, customerParams);
    })
    .then(function(customer) {
      CustomerStorage.setIdentity(customer);
      var addressParams = _.merge(Address.getAddressFromResidencyInformation($scope.user.residency), {details: $scope.user.addressSupplement});
      return Address.update(customer.id, addressParams);
    })
    .then(function(address) {
      CustomerStorage.setAddress(address);
      $scope.hasSignedUp();
    })
    .catch(function(errorMessage) {
      Popup.error(errorMessage);
    });
  };

  $scope.hasSignedUp = function() {
    Popup.alert('welcome', 'welcomeDetails')
    .then(function(){
      return DeviceAssistant.register();
    })
    .then(function(){
      $state.go('app.group-orders');
    })
    .catch(function(errorMessage){
      return Popup.error(errorMessage);
    });
  };

});
