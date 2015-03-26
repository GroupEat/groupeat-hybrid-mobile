'use strict';

angular.module('groupeat.controllers.restaurants', [
  'groupeat.services.customer',
  'groupeat.services.lodash',
  'groupeat.services.loading-backdrop',
  'groupeat.services.message-backdrop',
  'groupeat.services.network',
  'groupeat.services.popup',
  'groupeat.services.restaurant',
  'ngGeolocation',
  'ngMaterial'
])

.controller('RestaurantsCtrl', function($filter, $mdDialog, $q, $scope, $state, Customer, LoadingBackdrop, MessageBackdrop, Network, Popup, Restaurant, _, $geolocation) {

  var $translate = $filter('translate');

  $scope.restaurants = {};

  $scope.initCtrl = function() {
    $scope.loadingBackdrop = LoadingBackdrop.backdrop('backdrop-get', 'with-bar-and-tabs');
    $scope.onRefreshRestaurants()
    .finally(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
    });
  };

  $scope.onRefreshRestaurants = function() {
    var deferred = $q.defer();

    if (!Network.hasConnectivity())
    {
      $scope.messageBackdrop = MessageBackdrop.noNetwork();
      $scope.$broadcast('scroll.refreshComplete');
      deferred.reject();
    }
    else
    {
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
          deferred.resolve();
        })
        .catch(function() {
          $scope.messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurants()');
          deferred.reject();
        });
      })
      .catch(function() {
        $scope.messageBackdrop = MessageBackdrop.noGeolocation();
        deferred.reject();
      })
      .finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    return deferred.promise;
  };

  $scope.onRestaurantTouch = function(restaurantId) {
    // Checking if the customer has provided the needed further information before going further
    $scope.loadingBackdrop = LoadingBackdrop.backdrop('backdrop-interact' ,'with-bar-and-tabs');
    Customer.checkMissingInformation()
    .then(function() {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
      $state.go('restaurant-menu', {restaurantId: restaurantId});
    })
    .catch(function(missingPropertiesString) {
      $scope.loadingBackdrop = LoadingBackdrop.noBackdrop();
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

  $scope.initCtrl();

});
