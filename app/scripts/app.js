'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('groupeat', [
  'ionic', 'config', 'ngCordova', 'ngCookies', 'ngMessages',
  'validation.match', 'LocalStorageModule', 'permission',
  'routing', 'groupeat.controllers', 'groupeat.services', 'groupeat.directives'
])

.config(function($httpProvider, $translateProvider) {

  $httpProvider.interceptors.push('HttpProviderInterceptor');

  $translateProvider
  .useStaticFilesLoader({
    prefix: 'translations/',
    suffix: '.json'
  })
  .preferredLanguage('fr')
  .fallbackLanguage(['fr']).useLocalStorage();

})

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('orange');
})

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
  .setPrefix('groupeat');
})

.run([
  'validator',
  'ElementModifier',
  'ErrorMessageResolver',
  function (validator, ElementModifier, ErrorMessageResolver) {
    validator.registerDomModifier(ElementModifier.key, ElementModifier);
    validator.setDefaultElementModifier(ElementModifier.key);
    validator.setErrorMessageResolver(ErrorMessageResolver.resolve);
  }
])


.run(function($ionicPlatform, $translate, $rootScope, $state, Permission, Authentication) {

  Permission.defineRole('customer', function () {
    // If the returned value is *truthy* then the user has the role, otherwise they don't
    return Authentication.getCredentials();
  });

  if(typeof navigator.globalization !== 'undefined') {
    navigator.globalization.getPreferredLanguage(function(language) {
      $translate.use((language.value).split('-')[0]).then(function(data) {
        console.log('SUCCESS -> ' + data);
      }, function(error) {
        console.log('ERROR -> ' + error);
      });
    }, null);
  }

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });

  //PushNotifications.initialize();

});

// .run(function($cordovaSplashscreen) {
//   setTimeout(function() {
//     $cordovaSplashscreen.hide();
//   }, 5000);
// });
