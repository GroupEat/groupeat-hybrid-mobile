'use strict';

angular.module('groupeat', [
  'angularMoment',
  'config',
  'constants',
  'ionic',
  'jcs-autoValidate',
  'ngCordova',
  'ngCookies',
  'ngIOS9UIWebViewPatch',
  'ngMessages',
  'ngAnimate',
  'pascalprecht.translate',
  'permission',
  'routing',
  'validation.match',
  'groupeat.controllers',
  'groupeat.directives',
  'groupeat.filters',
  'groupeat.services.analytics',
  'groupeat.services.credentials',
  'groupeat.services.element-modifier',
  'groupeat.services.error-message-resolver',
  'groupeat.services.message-backdrop',
  'slickCarousel',
  'ui.mask'
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

.run(function ($ionicPlatform, $translate, $rootScope, $state, Analytics, Credentials, Permission, MessageBackdrop) {

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

  $rootScope.messageBackdrop = {};

  $rootScope.$on('displayMessageBackdrop', function(event, errorKey) {
    $rootScope.messageBackdrop = MessageBackdrop.backdropFromErrorKey(errorKey);
  });

  $rootScope.$on('hideMessageBackdrop', function() {
    $rootScope.messageBackdrop.status = 'hidden';
  });

  $rootScope.$on('$ionicView.afterEnter', function() {
    $rootScope.messageBackdrop.status = 'loading';
  });

  $rootScope.$on('$ionicView.beforeLeave', function() {
    $rootScope.messageBackdrop.status = 'hidden';
  });

  $ionicPlatform.ready(function () {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
