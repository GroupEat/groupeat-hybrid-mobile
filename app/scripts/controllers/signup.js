'use strict';

angular.module('groupeat.controllers.signup', [
  'groupeat.services.address',
  'groupeat.services.credentials',
  'groupeat.services.customer',
  'groupeat.services.lodash',
  'groupeat.services.network',
  'groupeat.services.popup',
  'ionic'
])

.controller('SignupCtrl', function (_, $ionicSlideBoxDelegate, $scope, $state, Address, Credentials, Customer, Network, Popup) {

  $scope.slideIndex = 0;
  $scope.user = {};

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
      var addressParams = _.merge(Address.getAddressFromResidencyInformation($scope.user.residency), {details: $scope.user.addressSupplement});
      return Address.update(customer.id, addressParams);
    })
    .then(function() {
      $state.go('app.group-orders');
    })
    .catch(function(errorMessage) {
      return Popup.error(errorMessage);
    });
  };

});
