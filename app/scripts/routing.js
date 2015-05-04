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
  .state('side-menu', {
    url: '/side-menu',
    abstract: true,
    templateUrl: '/templates/side-menu.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })
  .state('side-menu.group-orders', {
    url: '/',
    views: {
      'menuContent' :{
        templateUrl: 'templates/group-orders.html'
      }
    },
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })

  .state('side-menu.order', {
    url: '/order',
    views: {
      'menuContent' :{
        templateUrl: 'templates/order.html'
      }
    },
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
  .state('side-menu.restaurants', {
    url: '/restaurants',
    views: {
      'menuContent' :{
        templateUrl: 'templates/restaurants.html'
      }
    },
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
  .state('side-menu.settings', {
    url: '/settings',
    views: {
      'menuContent' :{
        templateUrl: 'templates/settings.html'
      }
    },
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
