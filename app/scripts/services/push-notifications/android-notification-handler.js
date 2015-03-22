'use strict';


angular.module('groupeat.services.push-notifications.android-notification-handler', [
  'ionic',
  'ngResource',
  'config',
  'groupeat.services.element-modifier'
])


.factory('AndroidNotificationHandler', function(ENV, $resource, $q, ElementModifier, $ionicModal) {

  var

  resource = $resource(ENV.apiEndpoint + '/notifications/:id'),

  config = {
    'senderID': '993639413774'
  },

  deferredRegistration;


  var

  /**
  * @ngdoc function
  * @name AndroidNotificationHandler#handleGCMRegisteredEvent
  * @methodOf AndroidNotificationHandler
  *
  * @description
  * Handles GCM 'registered' event
  * Private method
  */
  handleGCMRegisteredEvent = function(id) {
    if (id.length > 0 ) {
      var requestBody = {
        registrationId: id
      };
      resource.save(null, requestBody).$promise
      .then(function(response) {
        deferredRegistration.resolve(response);
      })
      .catch(function(errorResponse) {
        deferredRegistration.reject(ElementModifier.errorMsgFromBackend(errorResponse));
      });
    }
  },

  handleGCMMessageEvent = function() {
    $ionicModal.fromTemplateUrl('templates/modals/notification.html', {
      animation: 'slide-in-up'
    }).then(function(modal) {
      modal.show();
    });
  };


  var
  /**
  * @ngdoc function
  * @name AndroidNotificationHandler#onNotification
  * @methodOf AndroidNotificationHandler
  *
  * @description
  * On notification received callback method
  *
  */
  onNotification = function(event, notification) {

    switch(notification.event) {

    case 'registered':
      handleGCMRegisteredEvent(notification.regid);
      break;

    case 'message':
      handleGCMMessageEvent();
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
  * @name AndroidNotificationHandler#initialize
  * @methodOf AndroidNotificationHandler
  *
  * @description
  * Initialize the NotificationHandler object with a Deferred object
  *
  */
  initialize = function() {
    deferredRegistration = $q.defer();
  },

  /**
  * @ngdoc function
  * @name AndroidNotificationHandler#promise
  * @methodOf AndroidNotificationHandler
  *
  * @description
  * Return a promise for the registration event
  *
  */
  promise = function() {
    return deferredRegistration.promise;
  };


  return {
    initialize: initialize,
    promise: promise,
    config: config,
    onNotification: onNotification,
  };

});
