'use strict';

angular.module('groupeat.controllers.restaurants', [
  'groupeat.services.customer',
  'groupeat.services.lodash',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.popup',
  'groupeat.services.restaurant',
  'ngGeolocation',
  'ngMaterial'
])

.controller('RestaurantsCtrl', function($mdDialog, $scope, $state, Customer, Restaurant, MessageBackdrop, Network, Popup, _, $geolocation) {

  $scope.restaurants = {};

  $scope.onRefreshRestaurants = function() {
    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      $scope.$broadcast('scroll.refreshComplete');
      return;
    }
    $geolocation.getCurrentPosition()
    .then(function(currentPosition) {
      Restaurant.get(currentPosition.coords.latitude, currentPosition.coords.longitude)
      .then(function(restaurants) {
        $scope.restaurants = restaurants;
        if (_.isEmpty(restaurants))
        {
          $scope.messageBackdrop = {
            show: true,
            title: 'noRestaurantsTitle',
            details: 'noRestaurantsDetails',
            iconClasses: 'ion-android-restaurant',
            button: {
              text: 'reload',
              action: 'onRefreshRestaurants()'
            }
          };
        }
        else
        {
          $scope.messageBackdrop = MessageBackdrop.noBackdrop();
        }
      })
      .catch(function() {
        $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurants()');
      });
    })
    .catch(function() {
      $scope.messageBackdrop = MessageBackdrop.noGeolocation();
    })
    .finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.onRestaurantTouch = function(restaurantId) {
    // Checking if the customer has provided the needed further information before going further
    Customer.checkMissingInformation()
    .then(function() {
      $state.go('restaurant-menu', {restaurantId: restaurantId});
    })
    .catch(function(missingPropertiesString) {
      if (!missingPropertiesString)
      {
        Popup.displayError($translate('genericFailureDetails'), 3000);
      }
      else
      {
        var confirm = $mdDialog.confirm({
          parent: angular.element(document.body)
        })
        .title($translate('missingPropertiesTitle'))
        .content($translate('missingCustomerInformationMessage', {missingProperties: missingPropertiesString}))
        .ok($translate('settings'))
        .cancel($translate('cancel'));
        $mdDialog.show(confirm)
        .then(function() {
          $state.go('settings');
        });
      }
    });
  };

  $scope.onRefreshRestaurants();

});
