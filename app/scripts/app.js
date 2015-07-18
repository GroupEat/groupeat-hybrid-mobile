'use strict';

angular.module('groupeat', [
  'config',
  'constants',
  'ionic',
  'ionic.service.analytics',
  'jcs-autoValidate',
  'ngCordova',
  'ngCookies',
  'ngMessages',
  'ngAnimate',
  'pascalprecht.translate',
  'permission',
  'routing',
  'validation.match',
  'groupeat.controllers',
  'groupeat.directives',
  'groupeat.services.analytics',
  'groupeat.services.credentials',
  'groupeat.services.element-modifier',
  'groupeat.services.error-message-resolver',
  'slick',
  'ui.mask'
  'slick'
])

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

.run(function ($ionicPlatform, $ionicAnalytics, $translate, $rootScope, $state, Analytics, Credentials, Permission) {
  Permission.defineRole('customer', function () {
    return Credentials.get();
  });
  if (typeof navigator.globalization !== 'undefined') {
    navigator.globalization.getPreferredLanguage(function (language) {
      $translate.use(language.value.split('-')[0]).then(function (data) {
        console.log('SUCCESS -> ' + data);
      }, function (error) {
        console.log('ERROR -> ' + error);
      });
    }, null);
  }
  $ionicPlatform.ready(function () {

    $ionicAnalytics.register();

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    Analytics.startTrackerWithId('UA-62863405-1');
  });
});
