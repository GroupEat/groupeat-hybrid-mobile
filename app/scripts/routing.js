'use strict';
angular.module('routing', []).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: '',
    abstract: true,
    templateUrl: 'templates/layouts/app.html',
    data: {
      permissions: {
        only: ['customer'],
        redirectTo: 'app.authentication'
      }
    }
  })
  .state('app.authentication', {
    url: '/authentication',
    params: {
      slideIndex: 0
    },
    views: {
      'app': {
        templateUrl: 'templates/authentication.html',
        controller: 'AuthenticationCtrl'
      }
    },
    data: { permissions: { except: [] } }
  })
  .state('app.signup', {
    url: '/signup',
    views: {
      'app': {
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl'
      }
    },
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
  .state('app.restaurants', {
    url: '/restaurants',
    views: {
      'app': {
        templateUrl: 'templates/restaurants.html',
        controller: 'RestaurantsCtrl'
      }
    }
  })
  .state('app.restaurant-menu', {
    url: '/restaurant/:restaurantId/menu',
    views: {
      'app': {
        templateUrl: 'templates/restaurant-menu.html',
        controller: 'RestaurantMenuCtrl'
      }
    }
  })
  .state('app.settings', {
    url: '/settings',
    views: {
      'app': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise(function($injector) {
    var $state = $injector.get('$state');
    $state.go('app.group-orders');
  });
});
