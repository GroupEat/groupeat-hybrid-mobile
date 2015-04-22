'use strict';

angular.module('routing', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('authentication', {
    url:'/authentication',
    templateUrl: 'templates/authentication.html',
    data: {
      permissions: {
        except: []
      }
    }
  })

  .state('group-orders', {
    url: '/',
    templateUrl: 'templates/group-orders.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })
  .state('order', {
    url: '/order',
    templateUrl: 'templates/order.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })
  .state('cart', {
    url: '/cart',
    templateUrl: 'templates/cart.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })
  .state('restaurants', {
    url: '/restaurants',
    templateUrl: 'templates/restaurants.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })
  .state('restaurant-menu', {
    url: '/restaurant/:restaurantId/menu',
    templateUrl: 'templates/restaurant-menu.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })

  // states of settings
  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })
  .state('settings-notifications', {
    url: '/settings/settings-notifications',
    templateUrl: 'templates/settings/settings-notifications.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })
  .state('settings-profile', {
    url: '/settings-profile',
    templateUrl: 'templates/settings/settings-profile.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  });

  $urlRouterProvider.otherwise('/');
});
