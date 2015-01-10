'use strict';

angular.module('routing', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('authentication', {
    url:'/authentication',
    templateUrl: 'templates/authentication.html'
  })

  .state('group-orders', {
    url: '/group-orders',
    templateUrl: 'templates/group-orders.html'
  })
  .state('cart', {
    url: '/cart',
    templateUrl: 'templates/cart.html'
  })
  .state('restaurants', {
    url: '/restaurants',
    templateUrl: 'templates/restaurants.html'
  })
  .state('restaurant-menu', {
    url: '/restaurant/:restaurantId/menu',
    templateUrl: 'templates/restaurant-menu.html'
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

  $urlRouterProvider.otherwise('/group-orders');

});
