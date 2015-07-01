'use strict';

angular.module('groupeat.services.device-assistant', [
  'ngResource',
  'groupeat.services.push-notification'
])


.factory('DeviceAssistant', function($rootScope, $q, $resource, ENV, Credentials, PushNotification, $ionicPlatform) {

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
  registerDevice = function() {
    var deferred = $q.defer();

    var requestBody = {
      'UUID': device.uuid,
      'notificationToken': notificationToken,
      'platform': platform,
      'version': device.version,
      'model': device.model,
      'latitude': 48.7173,  // TODO: discuss the necessity of passing coordinates here and implement if needed
      'longitude': 2.23935  // TODO: s.a.
    };

    resource.save({id: Credentials.get().id}, requestBody).$promise
    .then(function() {
      deferred.resolve();
    })
    .catch(function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
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
      .then(function(registrationToken) {
        notificationToken = registrationToken;
        return registerDevice();
      })
      .then(function() {
        deferredRegistration.resolve();
      })
      .catch(function() {
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
  var register = function() {
    deferredRegistration = $q.defer();
    $ionicPlatform.ready(function(){
      onDeviceReady();
    });
    return deferredRegistration.promise;
  };


  return {
    register: register
  };

});
