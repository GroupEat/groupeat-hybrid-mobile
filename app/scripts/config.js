'use strict';

angular.module('config', [
  'groupeat.services.http-provider-interceptor',
  'ionic',
  'ionic.service.core',
  'LocalStorageModule',
  'ngCookies',
  'ngMaterial',
  'pascalprecht.translate'
])

.config(function($ionicAppProvider) {
  $ionicAppProvider.identify({
    /* jshint camelcase: false */   // The camelcase feature is deprecated by jshint and will soon be removed. So would be this line. 
    app_id: 'd1f6e877',
    api_key: 'a50a33809f344de407b835f9f31f36e3c1b717abb4bd8461'
  });
})

.config(function ($httpProvider, $translateProvider) {
  $httpProvider.interceptors.push('HttpProviderInterceptor');
  $translateProvider.useStaticFilesLoader({
    prefix: 'translations/',
    suffix: '.json'
  }).preferredLanguage('fr').fallbackLanguage(['fr']).useLocalStorage();
})

.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default').primaryPalette('orange');
})

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('groupeat');
});
