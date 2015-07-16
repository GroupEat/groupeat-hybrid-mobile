'use strict';
/* exported onNotification */
angular.module('groupeat.services.push-notification', [
  'constants',
  'groupeat.services.element-modifier',
  'ionic',
  'ngCordova'
])

.factory('PushNotification', function ($cordovaPush, $q, $rootScope, $state) {

  var

  config = {
      'android': {
        'senderID': '993639413774'
      },
      'ios': {
        'alert': 'true',
        'badge': 'true',
        'sound': 'true'
      }
    },

    platform,

    deferredRegistration;


  var
    /**
  * @ngdoc function
  * @name PushNotification#subscribe
  * @methodOf PushNotification
  *
  * @description
  * Subscribe to a Push Notifications service and register the device
  * Currently supported push notifications services :
  *   * Google Cloud Messaging (GCM) : Android
  *
  */
  subscribe = function (devicePlatform) {
    var deferred = $q.defer();

    platform = devicePlatform;
    $cordovaPush.register(config[platform]).then(function (response) {
      deferredRegistration = $q.defer();

      /* Bind onNotification callback method to the $cordovaPush's notificationReceived */
      $rootScope.$on('$cordovaPush:notificationReceived', onNotification);

      if (platform === 'ios') {
        deferredRegistration.resolve(response);
      }

      return deferredRegistration.promise;
    }).then(function (registrationToken) {
      deferred.resolve(registrationToken);
    }).catch(function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  },

  /**
  * @ngdoc function
  * @name PushNotification#handleRegisteredEvent
  * @methodOf PushNotification
  *
  * @description
  * Handles 'registered' event by resolving the deferred registration and returning the registration id with id
  * Private method
  * @param id: registration id received
  */
  handleRegisteredEvent = function (id) {
    if (id.length > 0) {
      deferredRegistration.resolve(id);
    } else {
      deferredRegistration.reject();
    }
  };


  var
  /**
  * @ngdoc function
  * @name PushNotification#handleGCMNotification
  * @methodOf PushNotification
  *
  * @description
  * Handles notifications sent by the GCM service
  * Android
  */
  handleGCMNotification = function (notification) {
    switch (notification.event) {
    case 'registered':
      handleRegisteredEvent(notification.regid);
      break;
    case 'message':
      if (notification.foreground === '0') {
        $state.go('app.group-orders');      // Switch to group orders view if the app is in the background
      }
      break;
    default:
      deferredRegistration.reject(notification.msg);
      break;
    }
  },

  /**
  * @ngdoc function
  * @name PushNotification#handleAPNNotification
  * @methodOf PushNotification
  *
  * @description
  * Handles notifications sent by the APN service
  * iOS
  */
  handleAPNNotification = function (notification) {
    if (notification.foreground === '0') {
      $state.go('app.group-orders');        // Switch to group orders view if the app is in the background
    }
  };


  var
  /**
  * @ngdoc function
  * @name PushNotification#onNotification
  * @methodOf PushNotification
  *
  * @description
  * On notification received callback method
  */
  onNotification = function (event, notification) {
    switch (platform) {
    case 'android':
      handleGCMNotification(notification);
      break;
    case 'ios':
      handleAPNNotification(notification);
      break;
    }
  };


  return {
    subscribe: subscribe
  };

});
