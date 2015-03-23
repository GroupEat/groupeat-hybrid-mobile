'use strict';


angular.module('groupeat.services.notification-handlers.android', [
  'ionic',
  'config',
  'groupeat.services.element-modifier'
])


.factory('GCMNotificationHandler', function($q, ElementModifier, $ionicModal) {

  var

  config = {
    'senderID': '993639413774'
  },

  message,

  deferredRegistration;


  var

  /**
  * @ngdoc function
  * @name GCMNotificationHandler#handleGCMRegisteredEvent
  * @methodOf GCMNotificationHandler
  *
  * @description
  * Handles GCM 'registered' event by resolving the deferred registration and returning the registration id with id
  * Private method
  * @param id: registration id sent by the GCM
  */
  handleGCMRegisteredEvent = function(id) {
    if (id.length > 0 ) {
      deferredRegistration.resolve(id);
    }
    deferredRegistration.reject();
  },

  /**
  * @ngdoc function
  * @name GCMNotificationHandler#handleGCMMessageEvent
  * @methodOf GCMNotificationHandler
  *
  * @description
  * Handles GCM 'message' event
  * Private method
  * @param msg: content of the received notification
  */
  handleGCMMessageEvent = function(msg) {
    message = msg;
    window.alert(msg);
    $ionicModal.fromTemplateUrl('templates/modals/notification.html', {
      animation: 'slide-in-up'
    }).then(function(modal) {
      modal.show();
    });
  };


  var
  /**
  * @ngdoc function
  * @name GCMNotificationHandler#onNotification
  * @methodOf GCMNotificationHandler
  *
  * @description
  * On notification received callback method
  */
  onNotification = function(event, notification) {

    switch(notification.event) {

    case 'registered':
      handleGCMRegisteredEvent(notification.regid);
      break;

    case 'message':
      handleGCMMessageEvent(notification.message);
      break;

    case 'error':
      window.alert('GCM error = ' + notification.msg);
      deferredRegistration.reject(notification.msg);
      break;

    default:
      window.alert('An unknown GCM event has occurred');
      break;

    }

  },

  /**
  * @ngdoc function
  * @name GCMNotificationHandler#initialize
  * @methodOf GCMNotificationHandler
  *
  * @description
  * Initialize the NotificationHandler's deferredRegistration with a Deferred object
  */
  initialize = function() {
    deferredRegistration = $q.defer();
  },

  /**
  * @ngdoc function
  * @name GCMNotificationHandler#promise
  * @methodOf GCMNotificationHandler
  *
  * @description
  * Return a promise for the registration event
  */
  promise = function() {
    return deferredRegistration.promise;
  },

  getConfig = function() {
    return config;
  },

  getMessage = function() {
    return message;
  };


  return {
    initialize: initialize,
    promise: promise,
    onNotification: onNotification,
    config: getConfig,
    message: getMessage
  };

});
