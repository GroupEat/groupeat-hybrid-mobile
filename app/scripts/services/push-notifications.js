'use strict';

/* exported onNotificationGCM */
/* exported onNotificationAPN */

angular.module('groupeat.services.push-notifications', [
  'config',
  'ngResource'
])
//factory for processing push notifications.
.factory('PushNotifications', function($rootScope, $cordovaPush, ENV, $resource, $q, ElementModifier) {

  var

  resource = $resource(ENV.apiEndpoint+'/notifications/:id'),

  androidConfig = {
    'senderID': '993639413774'
  };



  var

  registerDevice = function() {
    var defered = $q.defer();
    $cordovaPush.register(androidConfig)
    .then(function(result) {
      window.alert('NOTIFY registration succedeed : ' + result);
      defered.resolve();
    })
    .catch(function(err) {
      window.alert('NOTIFY registration falied : '+ err);
      defered.reject(err);
    });
    window.alert('Returning promise');
    return defered.promise;
  },

  subscribeToNotificationEvent = function() {
    var defered = $q.defer();
    window.alert('NOTIFY subscribing');
    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {

      switch(notification.event) {

      case 'registered':
        if (notification.regid.length > 0 ) {
          var requestBody = {
            registrationId: notification.regid
          };
          resource.save(null, requestBody).$promise
          .then(function(response) {
            window.alert('NOTIFY  Request notification succeeded :' + response);
            defered.resolve(response);
          })
          .catch(function(errorResponse) {
            window.alert('NOTIFY  Request notification failed :' + errorResponse);
            defered.reject(ElementModifier.errorMsgFromBackend(errorResponse));
          });
        }
        break;

      case 'message':
        // this is the actual push notification. its format depends on the data model from the push server
        window.alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
        break;

      case 'error':
        window.alert('GCM error = ' + notification.msg);
        defered.reject(notification.msg);
        break;

      default:
        window.alert('An unknown GCM event has occurred');
        break;

      }

    });

    return defered.promise;
  },

  initialize = function() {
    window.alert('Initializing PushNotifications service');
    var defered = $q.defer();
    document.addEventListener('deviceready', function(){
      registerDevice()
      .then(function() {
        return subscribeToNotificationEvent();
      })
      .then(function() {
        window.alert('Resolving');
        return defered.resolve();
      })
      .catch(function(err) {
        window.alert('Promise rejected');
        defered.reject(err);
      })
      .finally(function(){
        window.alert('Finally');
      });
      window.alert('TEST');
    }, false);
    return defered.promise;
  };

  return {
    initialize: initialize
  };

});
