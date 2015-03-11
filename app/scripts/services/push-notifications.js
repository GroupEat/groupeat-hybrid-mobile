'use strict';

/* exported onNotificationGCM */
/* exported onNotificationAPN */

angular.module('groupeat.services.push-notifications', [])
//factory for processing push notifications.
.factory('PushNotificationsService', function($rootScope, $cordovaPush, $http) {

  var androidConfig = {
    'senderID': '993639413774',
  };

  var onDeviceReady = function(){
    window.alert('NOTIFY device ready ');

    $cordovaPush.register(androidConfig).then(function(result) {
      window.alert('NOTIFY registration succedeed : ' + result);
    }, function(err) {
      window.alert('NOTIFY registration falied : '+ err);
    });

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      window.alert('Event : ' + event);
      window.alert('Notification : ' + notification);
      window.alert('Notification.event : ' + notification.event);
      switch(notification.event) {
      case 'registered':
        if (notification.regid.length > 0 ) {
          window.alert('registration ID = ' + notification.regid );
          var url = 'https://groupeat.fr/api/send-push-notification/' + notification.regid;
          $http.get(url).
          success(function(data, status, headers, config) {
            window.alert('NOTIFY  Request notification succeeded :' + data + ' '+ status + ' ' + headers + ' ' + config);
          }).
          error(function(data, status, headers, config) {
            window.alert('NOTIFY  Request notification failed :' + data + ' '+ status + ' ' + headers + ' ' + config);
          });
        }
        break;

      case 'message':
        // this is the actual push notification. its format depends on the data model from the push server
        window.alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
        break;

      case 'error':
        window.alert('GCM error = ' + notification.msg);
        break;

      default:
        window.alert('An unknown GCM event has occurred');
        break;
      }
    });


     // WARNING: dangerous to unregister (results in loss of tokenID)
     // $cordovaPush.unregister(options).then(function(result) {
     //   // Success!
     // }, function(err) {
     //   // Error
     // });

  };

  return {
    initialize : function() {
      document.addEventListener('deviceready', onDeviceReady, false);
    }
  };



  // function successHandler(result) {
  //   window.alert('NOTIFY  pushNotification.register succeeded.  Result = '+result);
  // }
  // function errorHandler(error) {
  //   window.alert('NOTIFY  '+error);
  // }
  //
  // return {
  //   initialize : function () {
  //     window.alert('NOTIFY  initializing');
  //     document.addEventListener('deviceready', this.onDeviceReady, false);
  //   },
  //
  //   onDeviceReady : function() {
  //     window.alert('NOTIFY  Device is ready.  Registering with GCM server');
  //
  //     //var elem = angular.module('groupeat.services.push-notifications');
  //     //var service = elem.injector().get('PushNotificationsService');
  //     var injector = angular.injector(['groupeat', 'groupeat.services.push-notifications']);
  //     var service = injector.get('PushNotificationsService');
  //     console.log('Debug service: ' + JSON.stringify(service));
  //
  //     //register with google GCM server
  //     var pushNotification = window.plugins.pushNotification;
  //     var gcmAppID = '993639413774'; // Google GCM's API key
  //     pushNotification.register(successHandler, errorHandler, {'senderID':gcmAppID,'ecb':'onNotificationGCM'});
  //     // pushNotification.register(successHandler, errorHandler, {
  //     //   'badge': 'true',
  //     //   'sound': 'true',
  //     //   'alert': 'true',
  //     //   'ecb': 'onNotificationAPN'
  //     // }); // required!
  //   },
  //
  //   registerID : function (id) {
  //     window.alert('NOTIFY  Registration...'+id);
  //     //Insert code here to store the user's ID on your notification server.
  //     //You'll probably have a web service (wrapped in an Angular service of course) set up for this.
  //     var url = 'https://groupeat.fr/send-push-notification/' + id;
  //     window.alert('NOTIFY  Sending notification request to Groupeat backend on route :' );
  //     $http.get(url).
  //     success(function(data, status, headers, config) {
  //       window.alert('NOTIFY  Request notification succeeded :' + data + ' '+ status + ' ' + headers + ' ' + config);
  //     }).
  //     error(function(data, status, headers, config) {
  //       window.alert('NOTIFY  Request notification failed :' + data + ' '+ status + ' ' + headers + ' ' + config);
  //     });
  //   },
  //   //unregister can be called from a settings area.
  //   unregister : function () {
  //     window.alert('unregister');
  //     var push = window.plugins.pushNotification;
  //     if (push) {
  //       push.unregister(function () {
  //         window.alert('unregister success');
  //       });
  //     }
  //   }
  //};
});




// ALL GCM notifications come through here.
// function onNotificationGCM(e) {
//   window.alert('EVENT > RECEIVED:' + e.event + '');
//   switch( e.event )
//   {
//   case 'registered':
//     if ( e.regid.length > 0 )
//     {
//       //document.getElementById('debug-message').innerHTML = e.regid;
//       //window.alert('REGISTERED with GCM Server > REGID:' + e.regid + '');
//
//       //call back to web service in Angular.
//       //This works for me because in my code I have a factory called
//       //      PushProcessingService with method registerID
//       var elem = angular.module('groupeat.services.push-notifications');
//       //var injector = elem.injector();
//       var service = elem.service('PushNotificationsService');
//       window.alert('Debug service: ' + JSON.stringify(service.registerID(e.regid)));
//     }
//     break;
//
//   case 'message':
//     // if this flag is set, this notification happened while we were in the foreground.
//     // you might want to play a sound to get the user's attention, throw up a dialog, etc.
//     if (e.foreground)
//     {
//       //we're using the app when a message is received.
//       window.alert('--INLINE NOTIFICATION--' + '');
//
//       // if the notification contains a soundname, play it.
//       //var my_media = new Media('/android_asset/www/'+e.soundname);
//       //my_media.play();
//       window.alert(e.payload.message);
//     }
//     else
//     {
//       // otherwise we were launched because the user touched a notification in the notification tray.
//       if (e.coldstart)
//       {
//         window.alert('--COLDSTART NOTIFICATION--' + '');
//       }
//       else
//       {
//         window.alert('--BACKGROUND NOTIFICATION--' + '');
//
//         // direct user here:
//         window.location = '#/tab/featured';
//       }
//     }
//
//     window.alert('MESSAGE > MSG: ' + e.payload.message + '');
//     window.alert('MESSAGE: '+ JSON.stringify(e.payload));
//     break;
//
//   case 'error':
//     window.alert('ERROR > MSG:' + e.msg + '');
//     break;
//
//   default:
//     window.alert('EVENT > Unknown, an event was received and we do not know what it is');
//     break;
//   }
// }
//
// function tokenHandler(result) {
//   window.alert('device token = ' + result);
//   // Your iOS push server needs to know the token before it can push to this device
//   // here is where you might want to send it the token for later use.
// }
//
// function successHandler(result) {
//   window.alert('Success :  ' + result);
// }
//
// function errorHandler(error) {
//   window.alert('Error :  ' + error);
// }
//
//
//
// var pushNotification;
//
// function onDeviceReady() {
//   document.addEventListener('backbutton', function(e) {window.alert('Backbutton tapped ' + e );}, false);
//   try {
//     pushNotification = window.plugins.pushNotification;
//     if (true/*device.platform === 'android' || device.platform === 'Android' || device.platform ===
//       'amazon-fireos'*/) {
//       pushNotification.register(successHandler, errorHandler, {
//         'senderID': 'hypnotic-spider-826',
//         'ecb': 'onNotificationGCM'
//       }); // required!
//     } else {
//       pushNotification.register(tokenHandler, errorHandler, {
//         'badge': 'true',
//         'sound': 'true',
//         'alert': 'true',
//         'ecb': 'onNotificationAPN'
//       }); // required!
//     }
//   } catch (err) {
//     var txt = 'There was an error on this page.\n\n';
//     txt += 'Error description: ' + err.message + '\n\n';
//     window.alert(txt);
//   }
// }
// // handle APNS notifications for iOS
//
// function onNotificationAPN(e) {
//   if (e.alert) {
//     // showing an alert also requires the org.apache.cordova.dialogs plugin
//     navigator.notification.alert(e.alert);
//   }
//   if (e.sound) {
//     // playing a sound also requires the org.apache.cordova.media plugin
//     window.alert('NOTIFY sound');
//     //var snd = new Media(e.sound);
//     //snd.play();
//   }
//   // if (e.badge) {
//   //   pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
//   // }
// }
// // handle GCM notifications for Android
//
// function onNotificationGCM(e) {
//   switch (e.event) {
//   case 'registered':
//     if (e.regid.length > 0) {
//       // Your GCM push server needs to know the regID before it can push to this device
//       // here is where you might want to send it the regID for later use.
//       window.alert('regID = ' + e.regid);
//     }
//     break;
//   case 'message':
//     // if this flag is set, this notification happened while we were in the foreground.
//     // you might want to play a sound to get the user's attention, throw up a dialog, etc.
//     if (e.foreground) {
//       // on Android soundname is outside the payload.
//       // On Amazon FireOS all custom attributes are contained within payload
//       //var soundfile = e.soundname || e.payload.sound;
//       // if the notification contains a soundname, play it.
//       // playing a sound also requires the org.apache.cordova.media plugin
//       window.alert('Play a sound');
//       //var myMedia = new Media('/android_asset/www/' + soundfile);
//       //myMedia.play();
//     }
//     break;
//   case 'error':
//     break;
//   default:
//     break;
//   }
//}
//
//
// document.addEventListener('deviceready', onDeviceReady, true);
