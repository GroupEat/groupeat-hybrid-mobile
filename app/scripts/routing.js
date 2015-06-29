'use strict';
angular.module('routing', []).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('authentication', {
    url: '/authentication',
    templateUrl: 'templates/authentication.html',
    data: { permissions: { except: [] } }
  }).state('app', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/layouts/app.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  }).state('app.group-orders', {
    url: '',
    views: {
      'app': {
        templateUrl: 'templates/group-orders.html',
        controller: 'GroupOrdersCtrl'
      }
    }
  }).state('app.orders', {
    url: '/orders',
    views: {
      'app': {
        templateUrl: 'templates/orders.html',
        controller: 'OrdersCtrl'
      }
    }
  }).state('cart', {
    url: '/cart',
    templateUrl: 'templates/cart.html',
    controller: 'CartCtrl',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  }).state('restaurants', {
    url: '/restaurants',
    templateUrl: 'templates/restaurants.html',
    controller: 'RestaurantsCtrl',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  }).state('restaurant-menu', {
    url: '/restaurant/:restaurantId/menu',
    templateUrl: 'templates/restaurant-menu.html',
    controller: 'RestaurantMenuCtrl',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  }).state('app.settings', {
    url: '/settings',
    views: {
      'app': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/');
});