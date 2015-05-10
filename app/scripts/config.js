'use strict';

angular.module('config', [
  'groupeat.services.http-provider-interceptor',
  'ionic',
  'LocalStorageModule',
  'ngCookies',
  'ngMaterial',
  'pascalprecht.translate',
])

.config(function($ionicConfigProvider){
  $ionicConfigProvider.tabs.position('bottom');
})

.config(function($httpProvider, $translateProvider) {

  $httpProvider.interceptors.push('HttpProviderInterceptor');

  $translateProvider
  .useStaticFilesLoader({
    prefix: 'translations/',
    suffix: '.json'
  })
  .preferredLanguage('fr')
  .fallbackLanguage(['fr']).useLocalStorage();

})

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('orange');
})

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
  .setPrefix('groupeat');
});
