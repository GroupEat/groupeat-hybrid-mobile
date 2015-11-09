'use strict';

angular.module('config', [
  'groupeat.services.http-provider-interceptor',
  'ionic',
  'LocalStorageModule',
  'ngCookies',
  'pascalprecht.translate'
])

.config(function ($httpProvider, $translateProvider) {
  $httpProvider.interceptors.push('HttpProviderInterceptor');
  $translateProvider.useStaticFilesLoader({
    prefix: 'translations/',
    suffix: '.json'
  }).preferredLanguage('fr').fallbackLanguage(['fr']).useLocalStorage();
})

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('groupeat');
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
});
