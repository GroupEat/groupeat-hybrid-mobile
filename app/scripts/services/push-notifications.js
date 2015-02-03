'use strict';

/* exported onNotificationGCM */

//factory for processing push notifications.
//angular.module('pushnotification', [])

angular.module('groupeat.services.push-notifications', [])

.factory('PushNotificationsService', function() {
  function onDeviceReady() {
    window.alert('NOTIFY  Device is ready.  Registering with GCM server');
    //register with google GCM server
    var pushNotification = window.plugins.pushNotification;
    var gcmAppID = 'hypnotic-spider-826';
    pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {'senderID':gcmAppID,'ecb':'onNotificationGCM'});
  }
  function gcmSuccessHandler(result) {
    window.alert('NOTIFY  pushNotification.register succeeded.  Result = '+result);
  }
  function gcmErrorHandler(error) {
    window.alert('NOTIFY  '+error);
  }
  return {
    initialize : function () {
      window.alert('NOTIFY  initializing');
      document.addEventListener('deviceready', onDeviceReady, false);
    },
    registerID : function (id) {
      window.alert('NOTIFY  Registration...'+id);
      //Insert code here to store the user's ID on your notification server.
      //You'll probably have a web service (wrapped in an Angular service of course) set up for this.
      //For example:
      // MyService.registerNotificationID(id).then(function(response){
      //   if (response.data.Result) {
      //
      //   } else {
      //     window.alert('NOTIFY  Registration failed');
      //   }
      // });
    },
    //unregister can be called from a settings area.
    unregister : function () {
      window.alert('unregister');
      var push = window.plugins.pushNotification;
      if (push) {
        push.unregister(function () {
          window.alert('unregister success');
        });
      }
    }
  };
});


// ALL GCM notifications come through here.
function onNotificationGCM(e) {
  window.alert('EVENT > RECEIVED:' + e.event + '');
  switch( e.event )
  {
  case 'registered':
    if ( e.regid.length > 0 )
    {
      window.alert('REGISTERED with GCM Server > REGID:' + e.regid + '');

      //call back to web service in Angular.
      //This works for me because in my code I have a factory called
      //      PushProcessingService with method registerID
      var elem = angular.element(document.querySelector('[ng-app]'));
      var injector = elem.injector();
      var service = injector.get('PushNotificationsService');
      service.registerID(e.regid);
    }
    break;

  case 'message':
    // if this flag is set, this notification happened while we were in the foreground.
    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
    if (e.foreground)
    {
      //we're using the app when a message is received.
      window.alert('--INLINE NOTIFICATION--' + '');

      // if the notification contains a soundname, play it.
      //var my_media = new Media('/android_asset/www/'+e.soundname);
      //my_media.play();
      window.alert(e.payload.message);
    }
    else
    {
      // otherwise we were launched because the user touched a notification in the notification tray.
      if (e.coldstart)
      {
        window.alert('--COLDSTART NOTIFICATION--' + '');
      }
      else
      {
        window.alert('--BACKGROUND NOTIFICATION--' + '');

        // direct user here:
        window.location = '#/tab/featured';
      }
    }

    window.alert('MESSAGE > MSG: ' + e.payload.message + '');
    window.alert('MESSAGE: '+ JSON.stringify(e.payload));
    break;

  case 'error':
    window.alert('ERROR > MSG:' + e.msg + '');
    break;

  default:
    window.alert('EVENT > Unknown, an event was received and we do not know what it is');
    break;
  }
}
