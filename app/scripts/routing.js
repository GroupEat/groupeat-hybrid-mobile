'use strict';
angular.module('routing', []).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('authentication', {
    url: '/authentication',
    templateUrl: 'templates/authentication.html',
    params: {
      slideIndex: 0
    },
    data: { permissions: { except: [] } }
  })
  .state('app', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/layouts/app.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  }).state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl',
    data: { permissions: { except: [] } }
  })
  .state('app.group-orders', {
    url: '',
    views: {
      'app': {
        templateUrl: 'templates/group-orders.html',
        controller: 'GroupOrdersCtrl'
      }
    }
  })
  .state('app.orders', {
    url: '/orders',
    views: {
      'app': {
        templateUrl: 'templates/orders.html',
        controller: 'OrdersCtrl'
      }
    }
  })
  .state('cart', {
    url: '/cart',
    templateUrl: 'templates/cart.html',
    controller: 'CartCtrl',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'authentication'
      }
    }
  })
  .state('app.restaurants', {
    url: '/restaurants',
    views: {
      'app': {
        templateUrl: 'templates/restaurants.html',
        controller: 'RestaurantsCtrl'
      }
    }
  }).state('app.restaurant-menu', {
    url: '/restaurant/:restaurantId/menu',
    views: {
      'app': {
        templateUrl: 'templates/restaurant-menu.html',
        controller: 'RestaurantMenuCtrl'
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
