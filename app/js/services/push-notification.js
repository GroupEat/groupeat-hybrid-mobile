'use strict';

/*global PushNotification:true*/

var pushConfig = {
  android: {
    senderID: '993639413774',
    icon: 'notification',
    iconColor: '#ff4e50'
  },
  ios: {
    alert: true,
    badge: true,
    sound: true
  }
};

angular.module('groupeat.services.push-notification', [
  'ionic',
  'ngConstants',
  'groupeat.services.lodash',
  'groupeat.services.element-modifier',
  'groupeat.services.device-assistant'
])

.run(function(Network, PushNotificationService) {
  Network.hasConnectivity().then(PushNotificationService.subscribe);
})

.factory('PushNotificationService', function (_, $ionicPlatform, $q, $log, DeviceAssistant) {

  var subscribe = function() {
    var defer = $q.defer();

    $ionicPlatform.ready(function() {
      if (_.isEmpty(ionic.Platform.device())) {
        $log.warn('no device, cancelling notifications subscription');
        defer.reject('no device');
        return;
      }

      var push = PushNotification.init(pushConfig);
      $log.log('notifications initialized', push);

      push.on('registration', function(data) {
        $log.log('notifications registered', data);
        DeviceAssistant.setNotificationToken(data.registrationId);
        defer.resolve();
      });

      push.on('notification', function(data) {
        $log.log('notification received', data);
        DeviceAssistant.update(data.additionalData.notificationId);
      });

      push.on('error', function (error) {
        $log.warn('notifications error', error);
        defer.reject(error);
      });
    });

    return defer.promise;
  };

  return {
    subscribe: subscribe
  };

});
