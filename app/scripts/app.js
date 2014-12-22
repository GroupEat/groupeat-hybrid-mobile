'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('groupeat', [
  'ionic', 'config', 'ngCookies',
  'pascalprecht.translate',
  'groupeat.controllers', 'groupeat.services', 'groupeat.directives'
])

.run(function($ionicPlatform) {

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
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
  $stateProvider
  .state('first-page', {
    url:'/first-page',
    templateUrl: 'templates/first-page.html'
  })
  .state('current-command', {
    url: '/current-command',
    templateUrl: 'templates/current-command.html'
  })
  .state('food-choice', {
    url: '/food-choice',
    templateUrl: 'templates/food-choice.html'
  })
  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
  });

  $urlRouterProvider.otherwise('/first-page');

  $translateProvider
  .useStaticFilesLoader({
    prefix: 'translations/',
    suffix: '.json'
  })
  .preferredLanguage('fr')
  .fallbackLanguage(['fr']).useLocalStorage();

});
