'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('groupeat', [
  'ionic', 'config', 'ngCordova', 'ngCookies',
  'pascalprecht.translate',
  'groupeat.controllers', 'groupeat.services', 'groupeat.directives'
])

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

  $stateProvider
  .state('first-page', {
    url:'/first-page',
    templateUrl: 'templates/first-page.html'
  })

  .state('orders', {
    url: '/orders',
    templateUrl: 'templates/orders.html'
  })
  .state('restaurant-list', {
    url: '/restaurant-list',
    templateUrl: 'templates/restaurant-list.html'
  })
  .state('restaurant-menu', {
    url: '/restaurant-menu',
    templateUrl: 'templates/restaurant-menu.html'
  })
  .state('restaurant-menu-section', {
    url: '/restaurant-menu-section:sectionid',
    templateUrl: 'templates/restaurant-menu-section.html'
    // controller: 'controllers/restaurant-menu.js'
  })
  .state('food-choice', {
    url: '/food-choice',
    templateUrl: 'templates/food-choice.html'
  })

  // states of settings
  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
  })
  .state('settings-notifications', {
    url: '/settings/settings-notifications',
    templateUrl: 'templates/settings/settings-notifications.html'
  })
  .state('settings-profile', {
    url: '/settings-profile',
    templateUrl: 'templates/settings/settings-profile.html'
  });

  $urlRouterProvider.otherwise('/orders');

  $translateProvider
  .useStaticFilesLoader({
    prefix: 'translations/',
    suffix: '.json'
  })
  .preferredLanguage('fr')
  .fallbackLanguage(['fr']).useLocalStorage();

})

.run(function($ionicPlatform, $translate) {

  $ionicPlatform.ready(function() {
    if(typeof navigator.globalization !== 'undefined') {
      navigator.globalization.getPreferredLanguage(function(language) {
        $translate.use((language.value).split('-')[0]).then(function(data) {
          console.log('SUCCESS -> ' + data);
        }, function(error) {
          console.log('ERROR -> ' + error);
        });
      }, null);
    }

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
});
