'use strict';

angular.module('groupeat.services.http-provider-interceptor', [
  'groupeat.services.credentials'
])

.factory('HttpProviderInterceptor', function ($injector, Credentials) {

  var request = function (config) {
    if (config.url.indexOf('ionic.io') === -1) {
      config.headers.Accept = 'application/vnd.groupeat.v1+json';
      var credentials = Credentials.get();
      if (credentials && credentials.token) {
        config.headers.Authorization = 'bearer ' + credentials.token;
      }
    }
    return config;
  },

  responseError = function(response) {
    if (response.status === 401 && response.data.data.errorKey && response.data.data.errorKey === 'userMustAuthenticate') {
      $injector.get('$state').go('authentication');
    }
    return response;
  };

  return {
    request: request,
    responseError: responseError
  };
});
