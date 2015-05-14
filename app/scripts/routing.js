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
    url: '/group-orders',
    views: {
      'menuContent' :{
        templateUrl: 'templates/group-orders.html'
      }
    }
  })

  .state('side-menu.order', {
    url: '/order/:orderId',
    views: {
      'menuContent' :{
        templateUrl: 'templates/order.html'
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
  .state('side-menu.settings', {
    url: '/settings',
    views: {
      'menuContent' :{
        templateUrl: 'templates/settings.html'
      }
    }
  });

  $urlRouterProvider.otherwise('/side-menu/group-orders');
});
