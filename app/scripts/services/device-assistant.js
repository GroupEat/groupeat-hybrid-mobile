'use strict';

angular.module('groupeat.services.device-assistant', [
  'ionic',
  'constants',
  'ngResource',
  'groupeat.services.lodash',
  'groupeat.services.credentials',
  'groupeat.services.push-notification'
])

<<<<<<< HEAD
.factory('DeviceAssistant', function(_, $ionicPlatform, $q, $resource, $rootScope, Credentials, ENV, PushNotification) {
=======
.factory('DeviceAssistant', function($rootScope, $q, _, $resource, ENV, Credentials, $ionicPlatform, PushNotification) {
>>>>>>> Check if the device is empty so that the device registration is not done in dev env

  var

  resource = $resource(ENV.apiEndpoint + '/customers/:id/devices'),

  device,

  platform,

  notificationToken,

  deferredRegistration;

  var
  /**
  * @ngdoc function
  * @name DeviceAssistant#registerDevice
  * @methodOf DeviceAssistant
  *
  * @description
  * Register the device to GroupEat's database
  */
  registerDevice = function () {
    var requestBody = {
      'UUID': device.uuid,
      'notificationToken': notificationToken,
      'platform': platform,
      'model': device.model,
    };
    return resource.save({ id: Credentials.get().id }, requestBody).$promise;
  };


  /**
  * @ngdoc function
  * @name DeviceAssistant#onDeviceReady
  * @methodOf DeviceAssistant
  *
  * @description
  * Callback method to the cordova 'deviceready' event
  * Sets the appropriate Notification handler according to the device's platform before processing the actual registration
  */
  var onDeviceReady = function() {
    device = ionic.Platform.device();

    if (device)
    {
      switch(device.platform) {
        case 'Android':
        case 'android':
        case 'amazon-fireos':
          platform = 'android';
          break;
        case 'iOS':
        case 'ios':
          platform = 'ios';
          break;
        default:
          deferredRegistration.reject();
          break;
      }
      PushNotification.subscribe(platform)
      .then(function (registrationToken) {
        notificationToken = registrationToken;
        return registerDevice();
      })
      .then(function () {
        deferredRegistration.resolve();
      })
      .catch(function () {
        deferredRegistration.reject();
      });
    }
  };

  /**
  * @ngdoc function
  * @name DeviceAssistant#register
  * @methodOf DeviceAssistant
  *
  * @description
  * Initiate the registration process of the device
  *
  */
  var register = function () {
    deferredRegistration = $q.defer();
    if (_.isEmpty(ionic.Platform.device())) {
      deferredRegistration.resolve();
    } else {
      $ionicPlatform.ready(function(){
        onDeviceReady();
      });
    }
    return deferredRegistration.promise;
  };

  return {
    register: register
  };

});
