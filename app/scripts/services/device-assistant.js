'use strict';


angular.module('groupeat.services.device-assistant', [
  'ionic',
  'ngResource',
  'ngCordova',
  'groupeat.services.notification-handlers'
])


.factory('DeviceAssistant', function($rootScope, $q, $resource, ENV, Credentials, $cordovaPush, GCMNotificationHandler) {

  var

  resource = $resource(ENV.apiEndpoint + '/customers/:id/devices'),

  device,

  notificationHandler,

  notificationToken,

  deferredRegistration;


  var

  /**
  * @ngdoc function
  * @name DeviceAssistant#subscribeToNotificationService
  * @methodOf DeviceAssistant
  *
  * @description
  * Subscribe to a Push Notifications service and register the device
  * Currently supported push notifications services :
  *   * Google Cloud Messaging (GCM) : Android
  *
  */
  subscribeToNotificationService = function() {
    var deferred = $q.defer();
    var config = notificationHandler.config();

    $cordovaPush.register(config)
    .then(function() {
      notificationHandler.initialize();
      $rootScope.$on('$cordovaPush:notificationReceived', notificationHandler.onNotification);
      return notificationHandler.promise();
    })
    .then(function(registrationToken) {
      deferred.resolve(registrationToken);
    })
    .catch(function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  },

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
      'hardwareId': device.uuid,
      'notificationToken': notificationToken,
      'operatingSystemId': '1',
      'operatingSystemVersion': device.version,
      'model': device.model,
      'latitude': 48.7173,  // TODO: discuss the necessity of passing coordinates here and implement if needed
      'longitude': 2.23935  // TODO: s.a.
    };
    resource.save({id: Credentials.get().id}, requestBody).$promise
    .then(function() {
      deferred.resolve();
    })
    .catch(function() {
      deferred.reject();
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
    device = window.device;

    switch(device.platform) {
      case 'Android':
      case 'android':
      case 'amazon-fireos':
        notificationHandler = GCMNotificationHandler;
        break;
      default:
        deferredRegistration.reject();
        break;
    }

    if (notificationHandler)
    {
      subscribeToNotificationService()
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

  },

  /**
  * @ngdoc function
  * @name DeviceAssistant#register
  * @methodOf DeviceAssistant
  *
  * @description
  * Initiate the registration process of the device
  *
  */
  register = function() {
    deferredRegistration = $q.defer();
    document.addEventListener('deviceready', onDeviceReady, false);
    return deferredRegistration.promise;
  };


  return {
    register: register,
  };

});
