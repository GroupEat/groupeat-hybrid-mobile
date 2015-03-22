'use strict';


angular.module('groupeat.services.push-notifications', [
  'ngCordova',
  'groupeat.services.push-notifications.android-notification-handler'
])


.factory('PushNotifications', function($rootScope, $cordovaPush, $q, AndroidNotificationHandler) {

  var

  notificationHandler,

  deferredSubscription;


  var

  /**
  * @ngdoc function
  * @name PushNotifications#bindNotificationHandler
  * @methodOf PushNotifications
  *
  * @description
  * Bind the notification handler to the '$cordovaPush:notificationReceived' event
  *
  */
  bindNotificationHandler = function() {
    notificationHandler.initialize();
    $rootScope.$on('$cordovaPush:notificationReceived', notificationHandler.onNotification);
    return notificationHandler.promise();
  };

  /**
  * @ngdoc function
  * @name PushNotifications#registerDevice
  * @methodOf PushNotifications
  *
  * @description
  * Register the device for 3rd party push-notification service
  * PushNotifications services currently supported :
  * Google Cloud Messaging (GCM) : Android
  *
  */
  var registerDevice = function() {
    var deferred = $q.defer();
    var config = notificationHandler.config;

    $cordovaPush.register(config)
    .then(function(result) {
      deferred.resolve(result);
    })
    .catch(function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  /**
  * @ngdoc function
  * @name PushNotifications#onDeviceReady
  * @methodOf PushNotifications
  *
  * @description
  * Callback method to the cordova 'deviceready' event
  * Sets the appropriate Notification handler acoording to the device's platform
  */
  var onDeviceReady = function() {
    var device = window.device;
    if ( device.platform === 'Android' || device.platform === 'android' || device.platform === 'amazon-fireos' )
    {
      notificationHandler = AndroidNotificationHandler;
    }
    else
    {
      deferredSubscription.reject();
    }

    registerDevice()
    .then(function() {
      return bindNotificationHandler();
    })
    .then(function() {
      return deferredSubscription.resolve();
    })
    .catch(function(err) {
      deferredSubscription.reject(err);
    });
  },

  /**
  * @ngdoc function
  * @name PushNotifications#subscribe
  * @methodOf PushNotifications
  *
  * @description
  * Subscribe the registered customer to the push-notifications service matching the device model
  * Platform currently supported :
  * Android
  *
  */
  subscribe = function() {
    deferredSubscription = $q.defer();
    document.addEventListener('deviceready', onDeviceReady, false);
    return deferredSubscription.promise;
  };


  return {
    subscribe: subscribe
  };

});
